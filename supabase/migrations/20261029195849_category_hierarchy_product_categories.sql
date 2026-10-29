alter table public.categories
  add column if not exists parent_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'categories_parent_id_fkey'
      and conrelid = 'public.categories'::regclass
  ) then
    alter table public.categories
      add constraint categories_parent_id_fkey
      foreign key (parent_id)
      references public.categories(id)
      on delete restrict;
  end if;
end
$$;

create index if not exists categories_parent_id_idx
  on public.categories (parent_id);

create or replace function private.validate_category_hierarchy()
returns trigger
language plpgsql
set search_path = public, private
as $$
declare
  ancestor_count integer := 0;
  max_descendant_distance integer := 0;
  cycle_detected boolean := false;
begin
  if new.parent_id is not null then
    if new.parent_id = new.id then
      raise exception using
        errcode = '23514',
        message = 'A category cannot be its own parent.';
    end if;

    with recursive ancestors as (
      select c.id, c.parent_id, 1 as distance
      from public.categories c
      where c.id = new.parent_id

      union all

      select c.id, c.parent_id, a.distance + 1
      from public.categories c
      join ancestors a on c.id = a.parent_id
      where a.distance < 4
    )
    select
      coalesce(max(distance), 0),
      coalesce(bool_or(id = new.id), false)
    into ancestor_count, cycle_detected
    from ancestors;

    if cycle_detected then
      raise exception using
        errcode = '23514',
        message = 'Category hierarchy cannot contain cycles.';
    end if;

    if ancestor_count = 0 then
      raise exception using
        errcode = '23503',
        message = 'Parent category does not exist.';
    end if;
  end if;

  if tg_op = 'UPDATE' then
    with recursive descendants as (
      select c.id, 1 as distance
      from public.categories c
      where c.parent_id = new.id

      union all

      select c.id, d.distance + 1
      from public.categories c
      join descendants d on c.parent_id = d.id
      where d.distance < 3
    )
    select
      coalesce(max(distance), 0),
      coalesce(bool_or(id = new.parent_id), false)
    into max_descendant_distance, cycle_detected
    from descendants;

    if cycle_detected then
      raise exception using
        errcode = '23514',
        message = 'A category cannot be moved below one of its descendants.';
    end if;
  end if;

  if ancestor_count + 1 + max_descendant_distance > 3 then
    raise exception using
      errcode = '23514',
      message = 'Category hierarchy is limited to three levels.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_category_hierarchy() from public, anon, authenticated;

drop trigger if exists categories_validate_hierarchy on public.categories;
create trigger categories_validate_hierarchy
before insert or update of parent_id
on public.categories
for each row
execute function private.validate_category_hierarchy();

create table if not exists public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create index if not exists product_categories_category_id_idx
  on public.product_categories (category_id);

alter table public.product_categories enable row level security;

revoke all privileges on table public.product_categories
from anon, authenticated;

grant select on table public.product_categories to anon;
grant select, insert, update, delete on table public.product_categories to authenticated;
grant select, insert, update, delete on table public.product_categories to service_role;

drop policy if exists "public can read published product category relations"
on public.product_categories;

create policy "public can read published product category relations"
on public.product_categories
for select
to anon
using (
  exists (
    select 1
    from public.products p
    where p.id = product_categories.product_id
      and p.status = 'published'::public.cms_content_status
  )
  and exists (
    select 1
    from public.categories c
    where c.id = product_categories.category_id
      and c.status = 'published'::public.cms_content_status
  )
);

drop policy if exists "cms admins manage product category relations"
on public.product_categories;

create policy "cms admins manage product category relations"
on public.product_categories
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

insert into public.product_categories (product_id, category_id)
select p.id, p.category_id
from public.products p
where p.category_id is not null
on conflict (product_id, category_id) do nothing;

create or replace function public.set_product_categories(
  p_product_id uuid,
  p_category_ids uuid[]
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_primary_category_id uuid;
begin
  if not exists (
    select 1
    from public.products
    where id = p_product_id
  ) then
    raise exception using
      errcode = '23503',
      message = 'Product does not exist.';
  end if;

  if exists (
    select 1
    from unnest(coalesce(p_category_ids, '{}'::uuid[])) as selected(category_id)
    where selected.category_id is not null
      and not exists (
        select 1
        from public.categories c
        where c.id = selected.category_id
      )
  ) then
    raise exception using
      errcode = '23503',
      message = 'One or more categories do not exist.';
  end if;

  select selected.category_id
  into v_primary_category_id
  from unnest(coalesce(p_category_ids, '{}'::uuid[]))
    with ordinality as selected(category_id, position)
  where selected.category_id is not null
  order by selected.position
  limit 1;

  delete from public.product_categories
  where product_id = p_product_id;

  insert into public.product_categories (product_id, category_id)
  select p_product_id, selected.category_id
  from (
    select distinct on (category_id)
      category_id,
      position
    from unnest(coalesce(p_category_ids, '{}'::uuid[]))
      with ordinality as input(category_id, position)
    where category_id is not null
    order by category_id, position
  ) selected
  order by selected.position;

  update public.products
  set category_id = v_primary_category_id
  where id = p_product_id;
end;
$$;

revoke all on function public.set_product_categories(uuid, uuid[])
from public, anon;

grant execute on function public.set_product_categories(uuid, uuid[])
to authenticated, service_role;
