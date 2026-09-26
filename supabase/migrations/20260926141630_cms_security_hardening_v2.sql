-- CMS authorization hardening after public Supabase migration.
-- Keep the public Data API explicitly read-only for anonymous visitors,
-- preserve authenticated CMS CRUD behind RLS, and avoid exposing draft media metadata.

revoke all privileges on table
  public.categories,
  public.cms_admins,
  public.concept_media,
  public.concepts,
  public.gallery_items,
  public.media_assets,
  public.product_concepts,
  public.product_media,
  public.products,
  public.store_settings
from anon, authenticated;

grant select on table
  public.categories,
  public.concept_media,
  public.concepts,
  public.gallery_items,
  public.media_assets,
  public.product_concepts,
  public.product_media,
  public.products,
  public.store_settings
to anon;

grant select, insert, update, delete on table
  public.categories,
  public.concept_media,
  public.concepts,
  public.gallery_items,
  public.media_assets,
  public.product_concepts,
  public.product_media,
  public.products,
  public.store_settings
to authenticated;

grant select on table public.cms_admins to authenticated;

revoke execute on function public.set_concept_cover(uuid, uuid) from public, anon;
revoke execute on function public.set_concept_products(uuid, uuid[]) from public, anon;
revoke execute on function public.set_product_cover(uuid, uuid) from public, anon;

grant execute on function public.set_concept_cover(uuid, uuid)
to authenticated, service_role;
grant execute on function public.set_concept_products(uuid, uuid[])
to authenticated, service_role;
grant execute on function public.set_product_cover(uuid, uuid)
to authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete, truncate, references, trigger on tables
  from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke usage, select, update on sequences
  from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions
  from public, anon, authenticated;

drop policy if exists "public can read media metadata" on public.media_assets;

create policy "public can read published media metadata"
on public.media_assets
for select
to anon
using (
  exists (
    select 1
    from public.categories c
    where c.cover_media_id = media_assets.id
      and c.status = 'published'::public.cms_content_status
  )
  or exists (
    select 1
    from public.product_media pm
    join public.products p on p.id = pm.product_id
    where pm.media_id = media_assets.id
      and p.status = 'published'::public.cms_content_status
  )
  or exists (
    select 1
    from public.concept_media cm
    join public.concepts c on c.id = cm.concept_id
    where cm.media_id = media_assets.id
      and c.status = 'published'::public.cms_content_status
  )
  or exists (
    select 1
    from public.concepts c
    where c.cover_media_id = media_assets.id
      and c.status = 'published'::public.cms_content_status
  )
  or exists (
    select 1
    from public.gallery_items g
    where g.media_id = media_assets.id
      and g.status = 'published'::public.cms_content_status
  )
);
