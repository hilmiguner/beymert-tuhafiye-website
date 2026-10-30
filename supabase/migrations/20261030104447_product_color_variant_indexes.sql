create index if not exists product_color_variants_color_id_idx
  on public.product_color_variants (color_id);

create index if not exists product_color_variants_series_id_idx
  on public.product_color_variants (series_id);
