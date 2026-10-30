create or replace function public.set_product_color_selections(
  p_product_id uuid,
  p_color_ids uuid[],
  p_series_ids uuid[]
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.products where id = p_product_id
  ) then
    raise exception using
      errcode = '23503',
      message = 'Product does not exist.';
  end if;

  if exists (
    select 1
    from unnest(coalesce(p_color_ids, '{}'::uuid[])) as selected(color_id)
    where not exists (
      select 1 from public.colors c
      where c.id = selected.color_id
        and c.is_active
    )
  ) then
    raise exception using
      errcode = '23503',
      message = 'One or more colors do not exist or are inactive.';
  end if;

  if exists (
    select 1
    from unnest(coalesce(p_series_ids, '{}'::uuid[])) as selected(series_id)
    where not exists (
      select 1 from public.color_series s
      where s.id = selected.series_id
        and s.is_active
    )
  ) then
    raise exception using
      errcode = '23503',
      message = 'One or more color series do not exist or are inactive.';
  end if;

  delete from public.product_colors
  where product_id = p_product_id;

  insert into public.product_colors (product_id, color_id, sort_order)
  select p_product_id, selected.color_id, selected.position - 1
  from (
    select distinct on (color_id)
      color_id,
      position
    from unnest(coalesce(p_color_ids, '{}'::uuid[]))
      with ordinality as input(color_id, position)
    order by color_id, position
  ) selected
  order by selected.position;

  delete from public.product_color_series
  where product_id = p_product_id;

  insert into public.product_color_series (product_id, series_id, sort_order)
  select p_product_id, selected.series_id, selected.position - 1
  from (
    select distinct on (series_id)
      series_id,
      position
    from unnest(coalesce(p_series_ids, '{}'::uuid[]))
      with ordinality as input(series_id, position)
    order by series_id, position
  ) selected
  order by selected.position;

  delete from public.product_color_variants v
  where v.product_id = p_product_id
    and (
      not exists (
        select 1
        from public.product_colors pc
        where pc.product_id = v.product_id
          and pc.color_id = v.color_id
      )
      or (
        v.series_id is not null
        and not exists (
          select 1
          from public.product_color_series ps
          where ps.product_id = v.product_id
            and ps.series_id = v.series_id
        )
      )
    );

  if coalesce(array_length(p_series_ids, 1), 0) = 0 then
    delete from public.product_color_variants
    where product_id = p_product_id
      and series_id is not null;

    insert into public.product_color_variants (
      product_id,
      color_id,
      series_id,
      media_id,
      sort_order
    )
    select
      pc.product_id,
      pc.color_id,
      null,
      null,
      pc.sort_order
    from public.product_colors pc
    where pc.product_id = p_product_id
    on conflict do nothing;
  else
    delete from public.product_color_variants
    where product_id = p_product_id
      and series_id is null;
  end if;

  update public.products p
  set colors = coalesce(
    (
      select array_agg(c.name order by pc.sort_order, c.sort_order, c.name)
      from public.product_colors pc
      join public.colors c on c.id = pc.color_id
      where pc.product_id = p_product_id
    ),
    '{}'::text[]
  )
  where p.id = p_product_id;
end;
$$;

revoke all on function public.set_product_color_selections(uuid, uuid[], uuid[])
from public, anon;
grant execute on function public.set_product_color_selections(uuid, uuid[], uuid[])
to authenticated, service_role;
