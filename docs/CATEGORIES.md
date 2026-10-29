# Product Categories

Kategori sisteminin güncel teknik ve içerik referansıdır.

## Veri kaynağı

Production kategori verisi Supabase `public.categories` tablosundan gelir.
`src/data/categories.ts` yalnızca Supabase erişilemediğinde kullanılan fallback
veridir.

## Üç seviyeli hiyerarşi

Kategori ağacı en fazla üç seviyedir:

1. Ana kategori
2. Alt kategori
3. Üçüncü seviye kategori

Örnek:

- Balon Çeşitleri
  - Lateks Balonlar
    - Krom Balonlar
    - Metalik Balonlar
    - Makaron Balonlar

`categories.parent_id` aynı tablodaki üst kategoriyi işaret eder. Ana
kategorilerde `parent_id = null` olur.

Veritabanı trigger'ı:

- dördüncü seviyeyi reddeder,
- kategorinin kendisini parent seçmesini reddeder,
- cycle oluşmasını engeller,
- alt dalı olan bir kategorinin taşınması sonucunda üç seviyenin aşılmasını
  engeller.

## CMS davranışı

`/admin/kategoriler` ekranında kategori ağacı hiyerarşik gösterilir.

Kategori oluşturma/düzenleme formunda:

- kategori seviyesi seçilir,
- ana kategoride üst kategori seçilmez,
- ikinci seviyede yalnız ana kategoriler parent olabilir,
- üçüncü seviyede yalnız ikinci seviye kategoriler parent olabilir,
- mevcut kategori kendi alt dallarından birinin altına taşınamaz.

Mevcut kategori kayıtları migration sırasında otomatik yeniden
sınıflandırılmaz. Böylece önceki URL, içerik ve ürün ilişkileri korunur; mağaza
gerçek taxonomy'si girilirken kategoriler kontrollü şekilde taşınabilir.

## Public site davranışı

- `/kategoriler` yalnız ana kategorileri ana kart olarak gösterir.
- İkinci ve üçüncü seviyeler ilgili ana kart altında görünür.
- `/kategoriler/[slug]` breadcrumb içinde kategori atalarını gösterir.
- Kategori detayında doğrudan alt kategoriler ve varsa üçüncü seviye gruplar
  listelenir.
- Ana veya alt kategori sayfası, yalnız doğrudan bağlı ürünleri değil, kendi alt
  dalındaki kategorilere bağlı ürünleri de gösterebilir.
- Ana sayfadaki kategori bölümü yalnız ana kategorileri gösterir.
- Sitemap bütün yayınlanmış kategori URL'lerini ayrı ayrı korur.

## Yayın durumu

Kategori durumları:

- `draft`
- `published`
- `archived`

Public kategori ağacında yalnız yayınlanmış kategoriler kullanılır. Bir alt
kategori yayınlanmış olsa bile yayınlanmış üst kategori zinciri yoksa public
ağaçta gösterilmez.

## Görseller

Kategori kartları mevcut fallback artwork sistemini ve varsa CMS medya
varlıklarını kullanmaya devam eder. Gerçek mağaza içeriği girildikçe temsili
görseller gerçek fotoğraflarla değiştirilecektir.
