-- Beymert CMS foundation
-- Auth is handled by Supabase Auth.
-- Public visitors only read published content.
-- CMS writes require membership in public.cms_admins.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'cms_content_status'
  ) then
    create type public.cms_content_status as enum ('draft', 'published', 'archived');
  end if;
end
$$;

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null check (length(trim(alt_text)) > 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  mime_type text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  cover_media_id uuid references public.media_assets(id) on delete set null,
  status public.cms_content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  description_rich jsonb,
  category_id uuid references public.categories(id) on delete set null,
  colors text[] not null default '{}',
  dimensions text,
  featured boolean not null default false,
  new_arrival boolean not null default false,
  whatsapp_message text,
  status public.cms_content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  description_rich jsonb,
  cover_media_id uuid references public.media_assets(id) on delete set null,
  status public.cms_content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_media (
  product_id uuid not null references public.products(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  primary key (product_id, media_id)
);

create table if not exists public.concept_media (
  concept_id uuid not null references public.concepts(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  primary key (concept_id, media_id)
);

create table if not exists public.product_concepts (
  product_id uuid not null references public.products(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  primary key (product_id, concept_id)
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media_assets(id) on delete restrict,
  title text not null default '',
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  concept_id uuid references public.concepts(id) on delete set null,
  status public.cms_content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id smallint primary key default 1 check (id = 1),
  address text,
  phone text,
  whatsapp text,
  opening_hours jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  map_query text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cms_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to anon, authenticated;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists concepts_set_updated_at on public.concepts;
create trigger concepts_set_updated_at
before update on public.concepts
for each row execute function public.set_updated_at();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

alter table public.cms_admins enable row level security;
alter table public.media_assets enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.concepts enable row level security;
alter table public.product_media enable row level security;
alter table public.concept_media enable row level security;
alter table public.product_concepts enable row level security;
alter table public.gallery_items enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "cms admins can read own membership" on public.cms_admins;
create policy "cms admins can read own membership"
on public.cms_admins
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public can read media metadata" on public.media_assets;
create policy "public can read media metadata"
on public.media_assets
for select
to anon, authenticated
using (true);

drop policy if exists "cms admins manage media metadata" on public.media_assets;
create policy "cms admins manage media metadata"
on public.media_assets
for all
to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read published categories" on public.categories;
create policy "public can read published categories"
on public.categories
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "cms admins manage categories" on public.categories;
create policy "cms admins manage categories"
on public.categories
for all
to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read published products" on public.products;
create policy "public can read published products"
on public.products
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "cms admins manage products" on public.products;
create policy "cms admins manage products"
on public.products
for all
to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read published concepts" on public.concepts;
create policy "public can read published concepts"
on public.concepts
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "cms admins manage concepts" on public.concepts;
create policy "cms admins manage concepts"
on public.concepts
for all
to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read product media relations" on public.product_media;
create policy "public can read product media relations"
on public.product_media
for select
to anon, authenticated
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
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read concept media relations" on public.concept_media;
create policy "public can read concept media relations"
on public.concept_media
for select
to anon, authenticated
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
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read published product concept relations" on public.product_concepts;
create policy "public can read published product concept relations"
on public.product_concepts
for select
to anon, authenticated
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
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read published gallery" on public.gallery_items;
create policy "public can read published gallery"
on public.gallery_items
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "cms admins manage gallery" on public.gallery_items;
create policy "cms admins manage gallery"
on public.gallery_items
for all
to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

drop policy if exists "public can read store settings" on public.store_settings;
create policy "public can read store settings"
on public.store_settings
for select
to anon, authenticated
using (true);

drop policy if exists "cms admins manage store settings" on public.store_settings;
create policy "cms admins manage store settings"
on public.store_settings
for all
to authenticated
using (public.is_cms_admin())
with check (public.is_cms_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'cms-media',
  'cms-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can view cms media" on storage.objects;
create policy "public can view cms media"
on storage.objects
for select
to public
using (bucket_id = 'cms-media');

drop policy if exists "cms admins upload media" on storage.objects;
create policy "cms admins upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
);

drop policy if exists "cms admins update media" on storage.objects;
create policy "cms admins update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
)
with check (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
);

drop policy if exists "cms admins delete media" on storage.objects;
create policy "cms admins delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_cms_admin()
);
