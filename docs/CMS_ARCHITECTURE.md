# Beymert CMS Architecture

## Amaç

Beymert içerik yönetim sistemi, dükkan sahibinin GitHub veya Vercel kullanmadan ürün, kategori, konsept, galeri, medya ve mağaza bilgilerini yönetebilmesini sağlar.

Public site müşteri hesabı kullanmaz. Supabase Auth yalnızca `/admin` alanı içindir.

## Stack

- Next.js 16 App Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security
- `@supabase/ssr` ile cookie tabanlı server-side auth

## İlk foundation kapsamı

Bu PR public site veri kaynağını henüz değiştirmez.

Eklenen temel parçalar:

- Supabase environment contract
- Browser/server Supabase client
- Next.js 16 `src/proxy.ts`
- `/admin/login`
- `/admin/setup`
- Korumalı `/admin` dashboard
- owner/editor admin modeli
- CMS database schema
- RLS policies
- `cms-media` Storage bucket tanımı

## Environment

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Service-role key client-side kullanılmayacaktır.

## İlk Supabase kurulumu

1. Supabase projesi oluştur.
2. `supabase/migrations/20260923_0001_cms_foundation.sql` migration'ını uygula.
3. Supabase Auth içinde dükkan sahibi hesabını oluştur.
4. Oluşturulan kullanıcının UUID'sini `cms_admins` tablosuna owner olarak ekle.
5. Project URL ve Publishable Key değerlerini local ve Vercel environment variable olarak tanımla.
6. `/admin/login` üzerinden giriş testi yap.

Örnek owner bootstrap işlemi, e-posta yerine Auth kullanıcısının UUID'si ile yapılmalıdır:

```sql
insert into public.cms_admins (user_id, role, display_name)
values ('AUTH_USER_UUID', 'owner', 'Beymert');
```

## Güvenlik modeli

- Anonymous/public kullanıcı yalnızca `published` içerikleri okuyabilir.
- Authenticated olmak tek başına CMS yetkisi vermez.
- CMS write işlemleri `public.is_cms_admin()` ile doğrulanır.
- `cms_admins` üyeliği migration veya güvenilir backend/admin işlemiyle yönetilir.
- Storage upload/update/delete yalnızca CMS adminlerine açıktır.
- Storage public read kullanır; bu nedenle yalnızca public sitede gösterilebilecek medya bu bucket'a konur.
- Draft kayıtların database satırları public RLS tarafından engellenir.

## Veri modeli

- `cms_admins`
- `media_assets`
- `categories`
- `products`
- `product_media`
- `concepts`
- `concept_media`
- `product_concepts`
- `gallery_items`
- `store_settings`

Rich text için hem düz metin hem de ileride TipTap JSON saklanabilecek `description_rich` alanı bulunur.

## Sonraki adımlar

1. Supabase projesini bağla ve migration'ı uygula.
2. Owner Auth hesabını oluştur.
3. Login/dashboard'u gerçek Supabase ortamında doğrula.
4. Category CRUD.
5. Product CRUD + media upload.
6. Concept CRUD + media upload.
7. Gallery CRUD.
8. Rich-text editor.
9. Draft/publish preview.
10. Store settings.
11. Public site data migration.
