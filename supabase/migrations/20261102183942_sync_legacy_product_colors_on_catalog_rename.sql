-- Keep the legacy products.colors array in sync when a catalog color is renamed.
-- IDs and product-color/variant/photo relationships remain untouched.
create or replace function public.sync_product_legacy_colors_on_rename()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.products p
  set colors = coalesce(
    (
      select array_agg(c.name order by pc.sort_order, c.sort_order, c.name)
      from public.product_colors pc
      join public.colors c on c.id = pc.color_id
      where pc.product_id = p.id
    ),
    '{}'::text[]
  )
  where exists (
    select 1
    from public.product_colors pc
    where pc.product_id = p.id
      and pc.color_id = new.id
  );
  return new;
end;
$$;

drop trigger if exists colors_sync_legacy_names on public.colors;
create trigger colors_sync_legacy_names
after update of name on public.colors
for each row
when (old.name is distinct from new.name)
execute function public.sync_product_legacy_colors_on_rename();
