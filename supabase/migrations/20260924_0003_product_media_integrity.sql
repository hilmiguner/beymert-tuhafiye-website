-- Ensure each product has at most one cover image.
create unique index if not exists product_media_one_cover_idx
  on public.product_media (product_id)
  where is_cover = true;
