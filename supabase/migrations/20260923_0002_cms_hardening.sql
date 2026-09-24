-- Beymert CMS hardening
-- Moves authorization helper out of the exposed public schema,
-- removes duplicate authenticated SELECT policies,
-- and adds covering indexes for CMS foreign keys.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.cms_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_cms_admin() from public;
grant execute on function private.is_cms_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "cms admins can read own membership" on public.cms_admins;
create policy "cms admins can read own membership"
on public.cms_admins
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "public can read media metadata" on public.media_assets;
create policy "public can read media metadata"
on public.media_assets
for select
to anon
using (true);

drop policy if exists "cms admins manage media metadata" on public.media_assets;
create policy "cms admins manage media metadata"
on public.media_assets
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read published categories" on public.categories;
create policy "public can read published categories"
on public.categories
for select
to anon
using (status = 'published');

drop policy if exists "cms admins manage categories" on public.categories;
create policy "cms admins manage categories"
on public.categories
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read published products" on public.products;
create policy "public can read published products"
on public.products
for select
to anon
using (status = 'published');

drop policy if exists "cms admins manage products" on public.products;
create policy "cms admins manage products"
on public.products
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read published concepts" on public.concepts;
create policy "public can read published concepts"
on public.concepts
for select
to anon
using (status = 'published');

drop policy if exists "cms admins manage concepts" on public.concepts;
create policy "cms admins manage concepts"
on public.concepts
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read product media relations" on public.product_media;
create policy "public can read product media relations"
on public.product_media
for select
to anon
using (
  exists (
    select 1 from public.products
    where products.id = product_media.product_id
      and products.status = 'published'
  )
);

drop policy if exists "cms admins manage product media" on public.product_media;
create policy "cms admins manage product media"
on public.product_media
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read concept media relations" on public.concept_media;
create policy "public can read concept media relations"
on public.concept_media
for select
to anon
using (
  exists (
    select 1 from public.concepts
    where concepts.id = concept_media.concept_id
      and concepts.status = 'published'
  )
);

drop policy if exists "cms admins manage concept media" on public.concept_media;
create policy "cms admins manage concept media"
on public.concept_media
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read published product concept relations" on public.product_concepts;
create policy "public can read published product concept relations"
on public.product_concepts
for select
to anon
using (
  exists (
    select 1 from public.products
    where products.id = product_concepts.product_id
      and products.status = 'published'
  )
  and exists (
    select 1 from public.concepts
    where concepts.id = product_concepts.concept_id
      and concepts.status = 'published'
  )
);

drop policy if exists "cms admins manage product concept relations" on public.product_concepts;
create policy "cms admins manage product concept relations"
on public.product_concepts
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read published gallery" on public.gallery_items;
create policy "public can read published gallery"
on public.gallery_items
for select
to anon
using (status = 'published');

drop policy if exists "cms admins manage gallery" on public.gallery_items;
create policy "cms admins manage gallery"
on public.gallery_items
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "public can read store settings" on public.store_settings;
create policy "public can read store settings"
on public.store_settings
for select
to anon
using (true);

drop policy if exists "cms admins manage store settings" on public.store_settings;
create policy "cms admins manage store settings"
on public.store_settings
for all
to authenticated
using (private.is_cms_admin())
with check (private.is_cms_admin());

drop policy if exists "cms admins upload media" on storage.objects;
create policy "cms admins upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'cms-media'
  and private.is_cms_admin()
);

drop policy if exists "cms admins update media" on storage.objects;
create policy "cms admins update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'cms-media'
  and private.is_cms_admin()
)
with check (
  bucket_id = 'cms-media'
  and private.is_cms_admin()
);

drop policy if exists "cms admins delete media" on storage.objects;
create policy "cms admins delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'cms-media'
  and private.is_cms_admin()
);

drop function if exists public.is_cms_admin();

create index if not exists categories_cover_media_id_idx
  on public.categories (cover_media_id);
create index if not exists concepts_cover_media_id_idx
  on public.concepts (cover_media_id);
create index if not exists products_category_id_idx
  on public.products (category_id);
create index if not exists media_assets_created_by_idx
  on public.media_assets (created_by);
create index if not exists gallery_items_media_id_idx
  on public.gallery_items (media_id);
create index if not exists gallery_items_category_id_idx
  on public.gallery_items (category_id);
create index if not exists gallery_items_concept_id_idx
  on public.gallery_items (concept_id);
create index if not exists product_media_media_id_idx
  on public.product_media (media_id);
create index if not exists concept_media_media_id_idx
  on public.concept_media (media_id);
create index if not exists product_concepts_concept_id_idx
  on public.product_concepts (concept_id);
create index if not exists store_settings_updated_by_idx
  on public.store_settings (updated_by);
