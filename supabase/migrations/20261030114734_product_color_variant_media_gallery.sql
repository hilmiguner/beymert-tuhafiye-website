-- One-to-many image associations per valid product color-series variant.
create table public.product_color_variant_media (
  variant_id uuid not null references public.product_color_variants(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0 check (sort_order >= 0),
  primary key (variant_id, media_id)
);

create index product_color_variant_media_media_id_idx
  on public.product_color_variant_media(media_id);

-- Preserve any single-photo assignments previously saved in the variant row.
insert into public.product_color_variant_media(variant_id, media_id, sort_order)
select id, media_id, 0
from public.product_color_variants
where media_id is not null
on conflict do nothing;

alter table public.product_color_variant_media enable row level security;

revoke all on table public.product_color_variant_media from anon, authenticated;
grant select on table public.product_color_variant_media to anon;
grant select, insert, update, delete on table public.product_color_variant_media to authenticated;
grant select, insert, update, delete on table public.product_color_variant_media to service_role;

create policy "public reads published product variant images"
on public.product_color_variant_media for select to anon
using (exists (
  select 1 from public.product_color_variants v
  join public.products p on p.id = v.product_id
  join public.product_media pm on pm.product_id = v.product_id
    and pm.media_id = product_color_variant_media.media_id
  where v.id = product_color_variant_media.variant_id
    and p.status = 'published'::public.cms_content_status
));

create policy "cms admins manage product variant images"
on public.product_color_variant_media for all to authenticated
using (private.is_cms_admin()) with check (private.is_cms_admin());

-- Atomic server-side replacement of valid variants and their ordered photos.

CREATE OR REPLACE FUNCTION public.set_product_color_variants(p_product_id uuid, p_variants jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  variant jsonb;
  image_item text;
  v_color_id uuid;
  v_series_id uuid;
  v_first_media_id uuid;
  v_media_id uuid;
  v_variant_id uuid;
  v_sort_order integer;
  v_image_position integer;
  v_image_ids jsonb;
begin
  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception using errcode = '23503', message = 'Product does not exist.';
  end if;
  if p_variants is null or jsonb_typeof(p_variants) <> 'array' then
    raise exception using errcode = '22023', message = 'Variants must be a JSON array.';
  end if;

  delete from public.product_color_variants where product_id = p_product_id;
  for variant in select value from jsonb_array_elements(p_variants)
  loop
    v_color_id := nullif(variant->>'color_id', '')::uuid;
    v_series_id := nullif(variant->>'series_id', '')::uuid;
    v_sort_order := coalesce((variant->>'sort_order')::integer, 0);

    if v_color_id is null or not exists (
      select 1 from public.product_colors pc
      where pc.product_id = p_product_id and pc.color_id = v_color_id
    ) then
      raise exception using errcode = '23503', message = 'Variant color is not selected for this product.';
    end if;
    if v_series_id is not null and not exists (
      select 1 from public.product_color_series ps
      where ps.product_id = p_product_id and ps.series_id = v_series_id
    ) then
      raise exception using errcode = '23503', message = 'Variant series is not selected for this product.';
    end if;

    if variant ? 'media_ids' then
      v_image_ids := variant->'media_ids';
      if jsonb_typeof(v_image_ids) <> 'array' then
        raise exception using errcode = '22023', message = 'media_ids must be an array.';
      end if;
    else
      v_image_ids := case
        when nullif(variant->>'media_id', '') is null then '[]'::jsonb
        else jsonb_build_array(variant->>'media_id') end;
    end if;

    v_first_media_id := null;
    v_image_position := 0;
    for image_item in select value from jsonb_array_elements_text(v_image_ids)
    loop
      v_media_id := nullif(image_item, '')::uuid;
      if v_media_id is null or not exists (
        select 1 from public.product_media pm
        where pm.product_id = p_product_id and pm.media_id = v_media_id
      ) then
        raise exception using errcode = '23503', message = 'Variant image must belong to this product.';
      end if;
      if v_first_media_id is null then v_first_media_id := v_media_id; end if;
    end loop;

    insert into public.product_color_variants
      (product_id, color_id, series_id, media_id, sort_order)
    values (p_product_id, v_color_id, v_series_id, v_first_media_id, greatest(v_sort_order, 0))
    on conflict (
      product_id, color_id,
      coalesce(series_id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) do update set media_id = excluded.media_id, sort_order = excluded.sort_order
    returning id into v_variant_id;

    for image_item in select value from jsonb_array_elements_text(v_image_ids)
    loop
      v_media_id := image_item::uuid;
      insert into public.product_color_variant_media(variant_id, media_id, sort_order)
      values(v_variant_id, v_media_id, v_image_position)
      on conflict (variant_id, media_id) do nothing;
      v_image_position := v_image_position + 1;
    end loop;
  end loop;
end;
$function$


revoke all on function public.set_product_color_variants(uuid, jsonb) from public, anon;
grant execute on function public.set_product_color_variants(uuid, jsonb)
  to authenticated, service_role;
