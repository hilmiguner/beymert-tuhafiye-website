# Real Content & Content Management

Phase 10 content kararlarının ana referansıdır.

## V1 kararı: typed static content

V1 için içerik kaynağı repository içindeki typed TypeScript data dosyalarıdır.

Supabase şu aşamada eklenmez.

Neden:
- tek mağaza
- e-ticaret yok
- kullanıcı hesabı yok
- stok rezervasyonu yok
- içerik güncelleme sıklığı henüz backend gerektirecek seviyede doğrulanmadı
- backend/admin eklemek deployment, auth, storage ve bakım yüzeyini gereksiz büyütür

Supabase ancak işletme sahibinin ürün/galeri içeriğini geliştirici olmadan düzenli güncellemesi gerçek operasyon ihtiyacı haline gelirse eklenir.

## Admin panel kararı

V1 için admin panel yoktur.

Admin panel değerlendirme koşulları:
- haftalık/sık ürün güncellemesi
- kampanya içeriklerinin mağaza tarafından yönetilmesi
- çok sayıda galeri yüklemesi
- birden fazla içerik yöneticisi
- stok benzeri operasyonel veri ihtiyacı

## Görsel asset stratejisi

V1 gerçek görselleri:

`public/media/`

altında tutulur.

Önerilen yapı:

- `public/media/products/<product-slug>/...`
- `public/media/concepts/<concept-slug>/...`
- `public/media/categories/...`
- `public/media/gallery/...`
- `public/media/brand/...`

UI, media alanı varsa otomatik olarak Next/Image kullanır; media yoksa mevcut CSS placeholder artwork devam eder.

Her image kaydı:
- src
- alt
- width
- height
- opsiyonel blurDataURL
- opsiyonel objectPosition

taşır.

## Image hazırlama

Production asset hedefi:
- mümkünse WebP/AVIF kaynak
- gereksiz 4K dosya yok
- ürün hero için yaklaşık 1600px uzun kenar yeterli
- kart/galeri varyantlarında doğru crop
- anlamlı Türkçe alt text
- dosya adında slug/tabanlı sade isim

Next/Image responsive sizes, lazy loading ve format optimizasyonunu üstlenir.

## Content integrity

`assertContentIntegrity()` build/runtime başlangıcında ilişkileri doğrular.

Kontroller:
- duplicate slug/id
- product -> category
- product -> concept
- concept -> category
- gallery -> product/concept/category
- media path
- alt text
- width/height

Bu kontrol sayesinde gerçek içerik girilirken bozuk route ilişkileri production'a taşınmaz.

## Phase 10 için kullanıcıdan gereken gerçek içerik

1. Final logo dosyası (tercihen SVG veya yüksek çözünürlüklü PNG)
2. Kesin açık mağaza adresi
3. Kesin çalışma saatleri
4. Gerçek ürün listesi
5. Her ürünün kategori bilgisi
6. Varsa ürün renk/ölçü seçenekleri
7. Gerçek konsept listesi
8. Ürün fotoğrafları
9. Konsept/kurulum fotoğrafları
10. Galeride özellikle gösterilmesi istenen çalışmalar

Bu veriler gelene kadar mevcut katalog içerikleri "temsili geliştirme içeriği" statüsündedir.
