# CMS Görsel Optimizasyonu ve Vercel Kota Yönetimi

## Kapsam

Bu çalışma Beymert web sitesinin Vercel Hobby **Image Optimization / Image
Cache Writes** tüketimini, sayfa hızını ve SEO'yu koruyarak azaltır.

- Branch: `feat/cms-preoptimized-images-cdn`
- Production ve mevcut Supabase verileri değişmeden PR üzerinden doğrulanır.
- Bu PR'da **veritabanı migrasyonu yoktur**; yeni dosya adlandırma sözleşmesi
  bütün gerekli bilgiyi içerir.
- Mevcut görseller kendiliğinden değiştirilmez; geçmiş içerik geçişi yalnız
  admin panelindeki açık işlemle yapılır.

## İnceleme sonuçları (20 Kasım 2026)

GitHub `main` commit: `22816b14cec3d4baf35d7d884b98fc34c22dcbb1`.

Supabase `cms-media` envanteri:

- Toplam dosya: **447**
- Toplam boyut: **703 MB**
- PNG: **429**
- JPEG: **18**
- WebP/AVIF: **0**
- 1 MB üzerindeki dosya: **424**
- Ortalama dosya boyutu: yaklaşık **1,6 MB**
- Dosyalar `cms-media` public bucket'ında kalıcı UUID yollarıyla saklanır.

Gözlenen yüklemeler (Europe/Istanbul tarihi):

- 13 Kasım: 22 dosya, 39,6 MB
- 19 Kasım: 69 dosya, 113,0 MB
- 20 Kasım: 53 dosya, 100,8 MB (inceleme anına kadar)

Bunlar **Storage yüklemeleridir**; Vercel'in dönüşüm veya önbellek yazma
sayıları değildir. Vercel Usage grafiğindeki günlerle örtüşür, fakat
bot/crawler yoğunluğu veya aynı görüntünün farklı boyutlarda tekrar istenmesi
hakkında kesin günlük istek dökümü değildir.

Mevcut `next/image` akışı:

1. `src/lib/public-products.ts`, `public-concepts.ts`, `public-gallery.ts`
   → `getPublicUrl(storage_path)`.
2. `ContentImageView` → `next/image` varsayılan Vercel loader.
3. Kart, detay, galeri ve lightbox farklı `sizes` ister; Next kendi ekran
   genişliği kümelerinden bir `srcSet` üretir.
4. `next.config.ts`: hem `image/avif` hem `image/webp` açık.
5. `next/image` uzak medya isteklerini `/_next/image?url=…&w=…&q=…`
   yoluna yönlendirir; cache MISS/STALE yeni dönüşüm ve cache write yaratabilir.

Cache write, Vercel'in yayımladığı modele göre **8 KB birimleriyle**
ölçülür. Farklı fotoğraflar ve farklı boyut/format varyantları ayrı önbellek
kayıtları üretebilir. Kullanıcının bildirdiği 76.445 birim
76.445 ayrı görsel ya da istek değildir.

## Seçilen mimari

### Yeni fotoğraf yükleme

CMS ürün, konsept ve galeri yüklemesi; geçerli JPEG, PNG, WebP ve AVIF
dosyalarını kabul etmeye devam eder (8 MB sınırı korunur).

Destekleyen tarayıcılarda yükleme öncesi Canvas + `createImageBitmap` ile
üç WebP çıktı üretilir:

| Dosya | Uzun kenar | Kalite (WebP) | Kullanım |
| --- | ---: | ---: | --- |
| `<uuid>.cmsopt-640.webp` | 640 px | 0,84 | Küçük kartlar/mobil |
| `<uuid>.cmsopt-1200.webp` | 1200 px | 0,89 | Orta boy ekranlar |
| `<uuid>.cmsopt.webp` | 2000 px | 0,94 | Büyük ekran, kapak, zoom |

- Görselin orijinal en-boy oranı ve saydamlığı korunur.
- Küçük kaynaklar büyütülmez.
- `media_assets.storage_path` yalnız son/master dosyayı işaret eder.
- `width/height` master ölçüleri olarak saklanır.
- Tüm dosyalar benzersiz, immutable yollar ve `cacheControl=31536000` ile
  Supabase Storage'da tutulur.
- Encodera sahip olmayan tarayıcılar orijinal fotoğrafı yüklemeye devam eder;
  bu görseller şimdilik eski `next/image` yolunu kullanır.
- Bir varyant yüklenemezse kısmi dosyalar temizlenir; fotoğraf DB kaydı
  oluşturulmaz.

### Müşteri tarafı

`ContentImageView`, yalnızca `*.cmsopt.webp` CMS görüntülerinde Next
`Image` için özel bir loader kullanır.

Bu loader width bilgisine göre **önceden hazırlanmış Supabase CDN adresini**
döndürür; `/_next/image` URL'si oluşturmaz. Böylece yeni CMS görselleri
için Vercel Image Transformations / Cache Writes oluşmaz.

Next/Image'ın `alt`, `sizes`, responsive `srcSet`, lazy-loading,
priority, `object-contain` ve `object-cover` davranışları korunur. Kart ve
galeri görsel sunumu değişmez.

Eski PNG/JPEG URL'leri Next/Image'ın eski varsayılan loader'ında kalır;
**eski kaynaklar migrate edilene dek kotayı kullanabilir**. Böylece mevcut
1–3 MB'lık dosyaları hiç sıkıştırmadan doğrudan sunup sayfa hızını bozmayız.

### Eski görselleri migrate etme (yalnızca açık admin işlemiyle)

Admin `/admin/gorsel-optimizasyonu` ekranı bir defada en fazla **10** eski
fotoğrafı optimize eder:

1. Orijinali Supabase CDN'den okur.
2. Üç WebP çıktı oluşturur ve Storage'a yükler.
3. Yalnız başarılı yüklemelerden sonra `media_assets.storage_path`,
   `mime_type`, `width`, `height` günceller.
4. Ürün, renk-seri, konsept ve galeri ilişkilerine dokunmaz.
5. Eski orijinal dosyayı **silmez**; gerektiğinde rollback kaynağıdır.

**Önemli:** Geçişte orijinaller ve türevler birlikte saklanacağından Supabase
Storage kullanımını izlemek gerekir. Şu an 703 MB kullanılan bucket'a bütün
fotoğrafları tek seferde çoğaltmak ücretsiz plan kotasını zorlayabilir.
Önce birkaç deneme dosyasıyla toplam ek boyut doğrulanmalı; ancak ardından
kademeli geçiş yapılmalıdır. Eski dosyaları toplu silme bu PR'ın kapsamı
dışındadır.

### Silme ve geri alma

Ürün, konsept ve galeri silme/rollback işlemleri artık `*.cmsopt.webp`
master ve iki türevini birlikte temizler. Eski fotoğraflar için önceki tek
dosyalı davranış devam eder.

## Sürdürülebilir kota değerlendirmesi

Yeni fotoğraflar ve optimize edilip migrate edilen eski fotoğraflar Vercel
Image Optimization servisini kullanmaz. Bu içerikler için Vercel Image Cache
Writes beklenen tüketim **sıfırdır**. Ancak eski PNG/JPEG kayıtları,
Next/Image kullanan diğer statik varlıklar ve Supabase CDN egress/depolama
harcamaları ayrı izlenmelidir.

- "100.000 cache writes" limitinin tamamen ortadan kalkması değil, bağımlılığın
  azalması hedefleniyor.
- Supabase CDN kullanımı, görselleri sunan bant genişliğini Supabase'e
  kaydırır; Supabase Storage/egress kullanımını da düzenli kontrol et.
- Vercel Hobby planı ticari siteler için uygun olmayabilir. Üretim sitesinin
  plan uygunluğu Vercel Fair Use ile ayrıca değerlendirilmelidir.
- 13/19 Kasım kaynaklı günlük istekleri ölçmek için Vercel Usage /
  Observability'de özellikle `/_next/image`, cache misses, width ve
  region bazında kayıtları incelemek gerekir. Hobby geçmiş log saklama süresi
  kısadır; bu PR, geçmiş trafik nedenlerini kesin sayılarla doğrulamaz.

## Doğrulama / Test planı

- `pnpm lint`
- `pnpm typecheck`
- `pnpm qa:images` (custom loader URL/width ve güvenli temizlik testi)
- `pnpm build`
- `pnpm qa:smoke`
- Preview'da ürün kartları, detay/kapak, renk filtreleri, lightbox, konsept
  ve galeri görsellerini kontrol et.
- Admin testinde 1 yeni ürün ve 1 fotoğrafla WebP yüklemeyi ve fotoğraf silme
  davranışını doğrula; **mevcut production verisini test amacıyla değiştirme**.
- Deployment'ın CDN fotoğraf URL'lerinde `/_next/image` yerine
  Supabase `/storage/v1/object/public/cms-media/...cmsopt*.webp` gördüğünü
  doğrula.
- Değişikliği ve üretim yayını **yalnız kullanıcı onayıyla** yap.

## Kaynaklar

- Vercel: https://vercel.com/docs/image-optimization/limits-and-pricing
- Vercel: https://vercel.com/docs/image-optimization/managing-image-optimization-costs
- Next.js: https://nextjs.org/docs/app/api-reference/components/image
- Supabase: https://supabase.com/docs/guides/storage/serving/image-transformations
- Supabase: https://supabase.com/docs/guides/storage/cdn/smart-cdn

## 20 Kasım 2026 — Geçiş sonrası production denetimi

- PR #47 üzerinden yeni CMS CDN mimarisi production'a alındı.
- 447 medya kaydının tamamı optimize WebP master yoluna geçti; Supabase Storage'da 447 master, 447 küçük (640), 447 orta (1200) WebP ve 447 eski orijinal bulunmaktadır (toplam 1.788 nesne).
- PR #48 ile özel `next/image` loader'ı Client Component içinde tutuldu; bu değişiklik ana sayfa ve ürün detayı HTTP 500 hatasını giderdi. Production sayfaları 8/8 HTTP 200 olarak doğrulandı.
- Ek taramada ana sayfanın Scroll Story bölümündeki dört ayrı, depoda değil repoda tutulan 960×720 WebP'nin hâlâ `/_next/image` kullandığı belirlendi. Dosya boyutları 10.946, 8.880, 11.058, 12.327 bayt (toplam **43.211 bayt**).
- Bu dört zaten küçük ve optimize edilmiş statik görselin hem mobil hem desktop görünümünde `unoptimized` ile doğrudan `/media/scroll-story/*.webp` yolundan sunulması planlandı. Kod testi bu dört dosyanın her birini **20 KiB** altında tutar ve iki `<Image>` kullanımının da `unoptimized` olmasını doğrular.
- `unoptimized` ayarı site genelinde **açılmamalıdır**: CMS görselleri hâlen `ContentImageView` üzerinden Supabase'in üç önceden hazırlanmış responsive CDN varyantını kullanır.
- Bu ek düzeltmenin beklenen faydası dört statik sahne dosyasına bağlı Vercel image transformations/cache writes tüketiminin önlenmesidir. Trafik ve Vercel kullanım geçmişinden tasarruf miktarı henüz ölçülmemiştir.
- Orijinaller geri dönüş güvenliği için korunmuştur; otomatik veya toplu silme yapılmaz. Supabase depolama ve egress kullanımı ayrıca takip edilir.
