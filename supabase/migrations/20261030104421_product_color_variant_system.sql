alter table public.product_media
  add column if not exists caption text not null default '';

create table if not exists public.colors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  group_key text not null
    check (group_key in ('basic', 'special', 'metallic_chrome', 'other')),
  hex text null
    check (hex is null or hex ~ '^#[0-9A-Fa-f]{6}$'),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists colors_name_ci_key
  on public.colors (lower(btrim(name)));

drop trigger if exists colors_set_updated_at on public.colors;
create trigger colors_set_updated_at
before update on public.colors
for each row execute function public.set_updated_at();

create table if not exists public.color_series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists color_series_name_ci_key
  on public.color_series (lower(btrim(name)));

drop trigger if exists color_series_set_updated_at on public.color_series;
create trigger color_series_set_updated_at
before update on public.color_series
for each row execute function public.set_updated_at();

create table if not exists public.product_colors (
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid not null references public.colors(id) on delete restrict,
  sort_order integer not null default 0 check (sort_order >= 0),
  primary key (product_id, color_id)
);

create index if not exists product_colors_color_id_idx
  on public.product_colors (color_id);

create table if not exists public.product_color_series (
  product_id uuid not null references public.products(id) on delete cascade,
  series_id uuid not null references public.color_series(id) on delete restrict,
  sort_order integer not null default 0 check (sort_order >= 0),
  primary key (product_id, series_id)
);

create index if not exists product_color_series_series_id_idx
  on public.product_color_series (series_id);

create table if not exists public.product_color_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid not null references public.colors(id) on delete restrict,
  series_id uuid null references public.color_series(id) on delete restrict,
  media_id uuid null references public.media_assets(id) on delete set null,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create unique index if not exists product_color_variants_unique_option
  on public.product_color_variants (
    product_id,
    color_id,
    coalesce(series_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

create index if not exists product_color_variants_product_id_idx
  on public.product_color_variants (product_id);

create index if not exists product_color_variants_media_id_idx
  on public.product_color_variants (media_id);

insert into public.colors (name, slug, group_key, hex, sort_order)
values
  ('Beyaz', 'beyaz', 'basic', '#F8F7F3', 1),
  ('Siyah', 'siyah', 'basic', '#222222', 2),
  ('Gri', 'gri', 'basic', '#9CA3AF', 3),
  ('Antrasit', 'antrasit', 'basic', '#4B5563', 4),
  ('Kırmızı', 'kirmizi', 'basic', '#D32F2F', 5),
  ('Bordo', 'bordo', 'basic', '#7F1D1D', 6),
  ('Sarı', 'sari', 'basic', '#FACC15', 7),
  ('Turuncu', 'turuncu', 'basic', '#F97316', 8),
  ('Yeşil', 'yesil', 'basic', '#22C55E', 9),
  ('Mavi', 'mavi', 'basic', '#3B82F6', 10),
  ('Pembe', 'pembe', 'basic', '#EC4899', 11),
  ('Mor', 'mor', 'basic', '#8B5CF6', 12),
  ('Kahverengi', 'kahverengi', 'basic', '#8B5E3C', 13),
  ('Krem', 'krem', 'basic', '#F3E7D3', 14),
  ('Ekru', 'ekru', 'basic', '#E9DDC7', 15),
  ('Ten Rengi', 'ten-rengi', 'basic', '#D9A27B', 16),
  ('Bebek Pembesi', 'bebek-pembesi', 'special', '#F6B8CF', 17),
  ('Pudra Pembe', 'pudra-pembe', 'special', '#D8A7B1', 18),
  ('Pudra Ten', 'pudra-ten', 'special', '#D8B29A', 19),
  ('Gül Kurusu', 'gul-kurusu', 'special', '#B76E79', 20),
  ('Fuşya', 'fusya', 'special', '#D81B60', 21),
  ('Bebek Mavisi', 'bebek-mavisi', 'special', '#A7C7E7', 22),
  ('Turkuaz', 'turkuaz', 'special', '#2DD4BF', 23),
  ('Saks Mavisi', 'saks-mavisi', 'special', '#1D4ED8', 24),
  ('Lacivert', 'lacivert', 'special', '#1E3A8A', 25),
  ('Mint Yeşili', 'mint-yesili', 'special', '#A7F3D0', 26),
  ('Adaçayı Yeşili', 'adacayi-yesili', 'special', '#9CAF88', 27),
  ('Lila', 'lila', 'special', '#C4B5FD', 28),
  ('Somon', 'somon', 'special', '#FA8072', 29),
  ('Kırık Beyaz', 'kirik-beyaz', 'special', '#F5F0E8', 30),
  ('Gold', 'gold', 'metallic_chrome', '#D4AF37', 31),
  ('Silver', 'silver', 'metallic_chrome', '#C0C0C0', 32),
  ('Rose Gold', 'rose-gold', 'metallic_chrome', '#B76E79', 33),
  ('Metalik Kırmızı', 'metalik-kirmizi', 'metallic_chrome', '#B71C1C', 34),
  ('Metalik Mavi', 'metalik-mavi', 'metallic_chrome', '#2458A6', 35),
  ('Metalik Pembe', 'metalik-pembe', 'metallic_chrome', '#C65385', 36),
  ('Metalik Mor', 'metalik-mor', 'metallic_chrome', '#6F42A6', 37),
  ('Metalik Yeşil', 'metalik-yesil', 'metallic_chrome', '#2E7D5B', 38),
  ('Krom Gold', 'krom-gold', 'metallic_chrome', '#C9A227', 39),
  ('Krom Silver', 'krom-silver', 'metallic_chrome', '#AEB4BA', 40),
  ('Krom Rose Gold', 'krom-rose-gold', 'metallic_chrome', '#C48A76', 41),
  ('Şeffaf', 'seffaf', 'other', '#E5E7EB', 42),
  ('Simli', 'simli', 'other', '#D1D5DB', 43),
  ('Çok Renkli', 'cok-renkli', 'other', '#C084FC', 44)
on conflict (slug) do update
set
  name = excluded.name,
  group_key = excluded.group_key,
  hex = excluded.hex,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.color_series (name, slug, sort_order)
values
  ('Standart (Klasik)', 'standart', 1),
  ('Makaron', 'makaron', 2),
  ('Retro', 'retro', 3),
  ('Neon', 'neon', 4),
  ('Metalik', 'metalik', 5),
  ('Krom', 'krom', 6)
on conflict (slug) do update
set name = excluded.name, sort_order = excluded.sort_order, is_active = true;

with legacy_names as (
  select distinct btrim(color_name) as name
  from public.products p
  cross join lateral unnest(p.colors) as color_name
  where length(btrim(color_name)) > 0
),
missing as (
  select l.name, row_number() over (order by lower(l.name), l.name) as rn
  from legacy_names l
  where not exists (
    select 1 from public.colors c
    where lower(btrim(c.name)) = lower(btrim(l.name))
  )
)
insert into public.colors (name, slug, group_key, hex, sort_order)
select name, 'legacy-' || substr(md5(lower(name)), 1, 16), 'other', null, 1000 + rn
from missing
on conflict do nothing;

insert into public.product_colors (product_id, color_id, sort_order)
select p.id, c.id, color_values.ordinality - 1
from public.products p
cross join lateral unnest(p.colors) with ordinality as color_values(color_name, ordinality)
join public.colors c
  on lower(btrim(c.name)) = lower(btrim(color_values.color_name))
where length(btrim(color_values.color_name)) > 0
on conflict (product_id, color_id) do update
set sort_order = least(public.product_colors.sort_order, excluded.sort_order);

insert into public.product_color_variants (product_id, color_id, series_id, media_id, sort_order)
select pc.product_id, pc.color_id, null, null, pc.sort_order
from public.product_colors pc
on conflict do nothing;

alter table public.colors enable row level security;
alter table public.color_series enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_color_series enable row level security;
alter table public.product_color_variants enable row level security;

revoke all privileges on table public.colors from anon, authenticated;
revoke all privileges on table public.color_series from anon, authenticated;
revoke all privileges on table public.product_colors from anon, authenticated;
revoke all privileges on table public.product_color_series from anon, authenticated;
revoke all privileges on table public.product_color_variants from anon, authenticated;

grant select on table public.colors to anon;
grant select on table public.color_series to anon;
grant select on table public.product_colors to anon;
grant select on table public.product_color_series to anon;
grant select on table public.product_color_variants to anon;

grant select, insert, update, delete on table public.colors to authenticated;
grant select on table public.color_series to authenticated;
grant select, insert, update, delete on table public.product_colors to authenticated;
grant select, insert, update, delete on table public.product_color_series to authenticated;
grant select, insert, update, delete on table public.product_color_variants to authenticated;

grant select, insert, update, delete on table public.colors to service_role;
grant select, insert, update, delete on table public.color_series to service_role;
grant select, insert, update, delete on table public.product_colors to service_role;
grant select, insert, update, delete on table public.product_color_series to service_role;
grant select, insert, update, delete on table public.product_color_variants to service_role;

drop policy if exists "public reads active colors" on public.colors;
create policy "public reads active colors" on public.colors
for select to anon using (is_active);

drop policy if exists "cms admins manage colors" on public.colors;
create policy "cms admins manage colors" on public.colors
for all to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public reads active color series" on public.color_series;
create policy "public reads active color series" on public.color_series
for select to anon using (is_active);

drop policy if exists "cms admins read color series" on public.color_series;
create policy "cms admins read color series" on public.color_series
for select to authenticated using (private.is_cms_admin());

drop policy if exists "public reads published product colors" on public.product_colors;
create policy "public reads published product colors" on public.product_colors
for select to anon
using (
  exists (
    select 1 from public.products p
    where p.id = product_colors.product_id
      and p.status = 'published'::public.cms_content_status
  )
  and exists (
    select 1 from public.colors c
    where c.id = product_colors.color_id and c.is_active
  )
);

drop policy if exists "cms admins manage product colors" on public.product_colors;
create policy "cms admins manage product colors" on public.product_colors
for all to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public reads published product color series" on public.product_color_series;
create policy "public reads published product color series" on public.product_color_series
for select to anon
using (
  exists (
    select 1 from public.products p
    where p.id = product_color_series.product_id
      and p.status = 'published'::public.cms_content_status
  )
  and exists (
    select 1 from public.color_series s
    where s.id = product_color_series.series_id and s.is_active
  )
);

drop policy if exists "cms admins manage product color series" on public.product_color_series;
create policy "cms admins manage product color series" on public.product_color_series
for all to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public reads published product color variants" on public.product_color_variants;
create policy "public reads published product color variants" on public.product_color_variants
for select to anon
using (
  exists (
    select 1 from public.products p
    where p.id = product_color_variants.product_id
      and p.status = 'published'::public.cms_content_status
  )
  and exists (
    select 1 from public.colors c
    where c.id = product_color_variants.color_id and c.is_active
  )
  and (
    product_color_variants.series_id is null
    or exists (
      select 1 from public.color_series s
      where s.id = product_color_variants.series_id and s.is_active
    )
  )
);

drop policy if exists "cms admins manage product color variants" on public.product_color_variants;
create policy "cms admins manage product color variants" on public.product_color_variants
for all to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

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
  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception using errcode = '23503', message = 'Product does not exist.';
  end if;

  if exists (
    select 1 from unnest(coalesce(p_color_ids, '{}'::uuid[])) as selected(color_id)
    where not exists (
      select 1 from public.colors c
      where c.id = selected.color_id and c.is_active
    )
  ) then
    raise exception using errcode = '23503',
      message = 'One or more colors do not exist or are inactive.';
  end if;

  if exists (
    select 1 from unnest(coalesce(p_series_ids, '{}'::uuid[])) as selected(series_id)
    where not exists (
      select 1 from public.color_series s
      where s.id = selected.series_id and s.is_active
    )
  ) then
    raise exception using errcode = '23503',
      message = 'One or more color series do not exist or are inactive.';
  end if;

  delete from public.product_colors where product_id = p_product_id;

  insert into public.product_colors (product_id, color_id, sort_order)
  select p_product_id, selected.color_id, selected.position - 1
  from (
    select distinct on (color_id) color_id, position
    from unnest(coalesce(p_color_ids, '{}'::uuid[]))
      with ordinality as input(color_id, position)
    order by color_id, position
  ) selected
  order by selected.position;

  delete from public.product_color_series where product_id = p_product_id;

  insert into public.product_color_series (product_id, series_id, sort_order)
  select p_product_id, selected.series_id, selected.position - 1
  from (
    select distinct on (series_id) series_id, position
    from unnest(coalesce(p_series_ids, '{}'::uuid[]))
      with ordinality as input(series_id, position)
    order by series_id, position
  ) selected
  order by selected.position;

  delete from public.product_color_variants v
  where v.product_id = p_product_id
    and (
      not exists (
        select 1 from public.product_colors pc
        where pc.product_id = v.product_id and pc.color_id = v.color_id
      )
      or (
        v.series_id is not null
        and not exists (
          select 1 from public.product_color_series ps
          where ps.product_id = v.product_id and ps.series_id = v.series_id
        )
      )
    );

  if coalesce(array_length(p_series_ids, 1), 0) = 0 then
    delete from public.product_color_variants
    where product_id = p_product_id and series_id is not null;

    insert into public.product_color_variants
      (product_id, color_id, series_id, media_id, sort_order)
    select pc.product_id, pc.color_id, null, null, pc.sort_order
    from public.product_colors pc
    where pc.product_id = p_product_id
    on conflict do nothing;
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

create or replace function public.set_product_color_variants(
  p_product_id uuid,
  p_variants jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  variant jsonb;
  v_color_id uuid;
  v_series_id uuid;
  v_media_id uuid;
  v_sort_order integer;
begin
  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception using errcode = '23503', message = 'Product does not exist.';
  end if;

  if p_variants is null or jsonb_typeof(p_variants) <> 'array' then
    raise exception using errcode = '22023',
      message = 'Variants must be a JSON array.';
  end if;

  delete from public.product_color_variants where product_id = p_product_id;

  for variant in select value from jsonb_array_elements(p_variants)
  loop
    v_color_id := nullif(variant->>'color_id', '')::uuid;
    v_series_id := nullif(variant->>'series_id', '')::uuid;
    v_media_id := nullif(variant->>'media_id', '')::uuid;
    v_sort_order := coalesce((variant->>'sort_order')::integer, 0);

    if v_color_id is null or not exists (
      select 1 from public.product_colors pc
      where pc.product_id = p_product_id and pc.color_id = v_color_id
    ) then
      raise exception using errcode = '23503',
        message = 'Variant color is not selected for this product.';
    end if;

    if v_series_id is not null and not exists (
      select 1 from public.product_color_series ps
      where ps.product_id = p_product_id and ps.series_id = v_series_id
    ) then
      raise exception using errcode = '23503',
        message = 'Variant series is not selected for this product.';
    end if;

    if v_media_id is not null and not exists (
      select 1 from public.product_media pm
      where pm.product_id = p_product_id and pm.media_id = v_media_id
    ) then
      raise exception using errcode = '23503',
        message = 'Variant image is not attached to this product.';
    end if;

    insert into public.product_color_variants
      (product_id, color_id, series_id, media_id, sort_order)
    values
      (p_product_id, v_color_id, v_series_id, v_media_id, greatest(v_sort_order, 0))
    on conflict (
      product_id,
      color_id,
      coalesce(series_id, '00000000-0000-0000-0000-000000000000'::uuid)
    )
    do update set media_id = excluded.media_id, sort_order = excluded.sort_order;
  end loop;
end;
$$;

revoke all on function public.set_product_color_variants(uuid, jsonb)
from public, anon;
grant execute on function public.set_product_color_variants(uuid, jsonb)
to authenticated, service_role;
