-- Atomically change the cover image of a product.
create or replace function public.set_product_cover(
  p_product_id uuid,
  p_media_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.product_media
    where product_id = p_product_id
      and media_id = p_media_id
  ) then
    raise exception 'Media is not attached to this product';
  end if;

  update public.product_media
  set is_cover = false
  where product_id = p_product_id
    and is_cover = true;

  update public.product_media
  set is_cover = true
  where product_id = p_product_id
    and media_id = p_media_id;
end;
$$;

revoke all on function public.set_product_cover(uuid, uuid) from public;
grant execute on function public.set_product_cover(uuid, uuid) to authenticated;
