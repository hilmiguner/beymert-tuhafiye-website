# SEO, Accessibility & Performance

Phase 11 teknik audit ve uygulama notları.

## SEO

Eklenen altyapı:

- merkezi URL resolver
- page-level canonical URL
- Open Graph metadata
- Twitter summary metadata
- dynamic product/category/concept metadata
- `/sitemap.xml`
- `/robots.txt`
- WebSite JSON-LD
- LocalBusiness JSON-LD

Production origin öncelik sırası:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `VERCEL_URL`
4. lokal fallback: `http://localhost:3000`

Production deployment öncesi `NEXT_PUBLIC_SITE_URL` kesin domain ile ayarlanmalıdır.

### Structured data sınırı

Public kaynaklarda tam adres ve çalışma saatleri çelişkili olduğu için JSON-LD içinde:

- doğrulanmış telefon
- işletme adı
- Facebook
- Gemlik / Bursa locality
- harita araması

kullanılır.

Doğrulanmamış sokak, kapı numarası ve openingHours schema içine eklenmez.

Gerçek katalog doğrulanana kadar Product schema da eklenmez.

## Accessibility

### Keyboard

- skip link: "Ana içeriğe geç"
- bütün route main alanları `#main-content`
- mobile menu kapalıyken `inert`
- aktif nav linkinde `aria-current="page"`
- mobile menu Escape ile kapanır
- gallery lightbox açıldığında focus modal içine taşınır
- Tab / Shift+Tab modal içinde döner
- Escape modalı kapatır
- ArrowLeft / ArrowRight galeri navigasyonu yapar
- modal kapanınca focus açan elemana geri döner

### Focus

Global `:focus-visible` ring korunur.

Skip link yalnız klavye ile odaklandığında görünür.

### Contrast

Temel token kontrolü:

- foreground / background: yüksek kontrast
- muted / background: AA metin kontrastı
- secondary / white: AA
- eski primary `#D13F73` / white yaklaşık 4.50:1 sınırının hemen altındaydı
- primary `#D03D72` olarak güncellendi; white ile yaklaşık 4.57:1

Görsel değişim marka hissini koruyacak kadar küçüktür.

### Reduced motion

Kontrol edilen animasyon katmanları:

- Hero / GSAP
- Scroll Story / ScrollTrigger
- Gallery / Motion
- Product filtering / Motion
- CSS hover/transitions

`prefers-reduced-motion: reduce` durumunda uzun timeline/scrub kapalıdır ve Product Catalog Motion süreleri sıfırlanır.

## Images

Gerçek fotoğraf pipeline'ı Phase 10'da hazırlanmıştır:

- Next/Image
- responsive `sizes`
- lazy loading varsayılanı
- typed alt text
- width / height metadata
- placeholder fallback

Mevcut CSS artwork'ler bitmap request oluşturmaz.

## Bundle / runtime

Runtime dependency auditinde Lenis'in repository içinde kullanılmadığı doğrulandı ve dependency kaldırıldı.

GSAP:
- Hero
- Scroll Story

Motion:
- Product filter
- Gallery

gibi gerçekten interaktif client katmanlarda kalır.

Static content route'ları server/static rendering kullanmaya devam eder.

## Security / best practices headers

Next config:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- kamera / mikrofon / geolocation permissions kapalı
- `poweredByHeader: false`
- compression açık
- Next/Image AVIF + WebP formatları

## Phase 12'ye kalan ölçümler

Gerçek production domain ve gerçek fotoğraflar olmadan aşağıdaki skorları final kabul etmiyoruz:

- Lighthouse Performance
- Lighthouse Accessibility
- Lighthouse Best Practices
- Lighthouse SEO
- LCP
- CLS
- INP
- gerçek cihaz Safari/iOS
- gerçek cihaz Chrome/Android

Hedefler:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+


## Local SEO production audit — 2026-09-30

Production üzerinde doğrulananlar:

- `/gemlik-parti-malzemeleri`: 200, canonical `https://www.beymerttuhafiye.com/gemlik-parti-malzemeleri`, `index, follow`, tek H1.
- `/gemlik-tuhafiye`: 200, canonical `https://www.beymerttuhafiye.com/gemlik-tuhafiye`, `index, follow`, tek H1.
- `/bursa-parti-malzemeleri`: 200, canonical `https://www.beymerttuhafiye.com/bursa-parti-malzemeleri`, `index, follow`, tek H1.
- `/bursa-tuhafiye`: 200, canonical `https://www.beymerttuhafiye.com/bursa-tuhafiye`, `index, follow`, tek H1.
- Kritik kategori örnekleri `/kategoriler/balonlar` ve `/kategoriler/tul-kurdele-tuhafiye`: 200, doğru canonical, `index, follow`, tek H1.
- `robots.txt`: public crawl açık, `/admin` ve `/preview` disallow, sitemap canonical host üzerinde.
- `sitemap.xml`: Gemlik/Bursa local landing page'leri ve dinamik kategori/konsept/ürün route'ları canonical `www` host ile listeleniyor.

NAP audit bulguları:

- Site canonical adresi: `Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa`.
- Yandex kaydı: `Hamidiye Mah., Irmak Sok., No:32/1C, Gemlik, Bursa` — eski/çelişkili.
- Güncel harita/business kaydı: `Hamidiye, Kuvayi Milliye Bl. 2/A, Gemlik/Bursa` — site canonical adresinden farklı adres gösterimi.
- Telefon: `+90 543 337 70 04` kaynaklarda tutarlı.

Sonraki harici aksiyon: Google Business Profile / harita kaydı ve Yandex işletme kaydında adresi işletme sahibinin doğruladığı canonical adres standardına yaklaştırmak; fiziksel konum platform tarafından farklı cadde/sokak adıyla normalize ediliyorsa bunu mağaza sahibi hesabından doğrulamak.


## Search Console baseline — 2026-09-30

Property:

- `sc-domain:beymerttuhafiye.com`
- Search Console settled data through: 2026-09-27
- Son 28 gün: 0 clicks, 0 impressions, 0 CTR.
- Search Console performance datası henüz organik görünürlük üretmediği için average position anlamlı bir baseline vermiyor.

Ana hedef sorguların başlangıç durumu:

| Query | Impressions | Clicks | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| Gemlik Tuhafiye | 0 | 0 | 0% | — |
| Gemlik Parti Malzemeleri | 0 | 0 | 0% | — |
| Bursa Tuhafiye | 0 | 0 | 0% | — |
| Bursa Parti Malzemeleri | 0 | 0 | 0% | — |

URL Inspection:

- `https://www.beymerttuhafiye.com/` — PASS, Submitted and indexed, Googlebot Smartphone crawl successful; son crawl 2026-09-29.
- `/gemlik-parti-malzemeleri` — PASS, Submitted and indexed; sitemap referansı üzerinden keşfedilmiş; son crawl 2026-09-29.
- `/gemlik-tuhafiye` — PASS, Submitted and indexed; sitemap referansı üzerinden keşfedilmiş; son crawl 2026-09-27.
- `/bursa-parti-malzemeleri` — URL is unknown to Google; henüz crawl edilmemiş.
- `/bursa-tuhafiye` — URL is unknown to Google; henüz crawl edilmemiş.
- `/kategoriler/balonlar` — URL is unknown to Google; henüz crawl edilmemiş.

Sitemap durumu:

- `https://www.beymerttuhafiye.com/sitemap.xml` mevcut ve Search Console'a kayıtlı.
- Search Console sitemap özeti son raporda eski/stale bir `indexed: 0` değeri gösterirken URL Inspection üç önemli URL'nin gerçekten indexed olduğunu doğruluyor; indeks kararı için URL Inspection daha güncel referans olarak kullanılmalı.
- Canlı sitemap production üzerinde Gemlik/Bursa landing page'leri dahil 45 URL döndürüyor.
- Sitemap'i programatik olarak yeniden gönderme denemesi GSC bağlantısındaki read-only OAuth scope nedeniyle reddedildi. Yeniden submit gerekirse GSC Wizard hesabında full Search Console access açılmalı veya Search Console arayüzünden manuel yapılmalı.

Ölçüm yorumu:

Bu baseline bir sıralama düşüşünü değil, yeni domain/site için henüz arama görünürlüğü oluşmadığını gösterir. İlk anlamlı SEO karşılaştırması impressions oluşmaya başladıktan sonra yapılacaktır.


### Indexing tracker ve keyword cluster

2026-09-30 itibarıyla GSC Wizard Indexing Tracker aktif edildi.

Takip edilen 8 kritik URL:

- Ana sayfa
- Gemlik Parti Malzemeleri
- Gemlik Tuhafiye
- Bursa Parti Malzemeleri
- Bursa Tuhafiye
- Balonlar kategorisi
- Doğum Günü kategorisi
- Tül · Kurdele · Tuhafiye kategorisi

İlk tracker snapshot:

- Total: 8
- Indexed: 3
- Not indexed: 5
- Pending: 0
- Errors: 0
- Warnings: 0

Indexed:

- Ana sayfa
- `/gemlik-parti-malzemeleri`
- `/gemlik-tuhafiye`

Not indexed / henüz Google tarafından yeterince işlenmemiş:

- `/bursa-parti-malzemeleri` — URL is unknown to Google
- `/bursa-tuhafiye` — URL is unknown to Google
- `/kategoriler/balonlar` — URL is unknown to Google
- `/kategoriler/dogum-gunu` — URL is unknown to Google
- `/kategoriler/tul-kurdele-tuhafiye` — Discovered - currently not indexed

Ayrıca `Beymert Local SEO Targets` topic cluster'ı oluşturuldu. Cluster; dört ana ticari sorgunun yanında Gemlik balon, helyumlu balon, doğum günü, baby shower, cinsiyet partisi, söz-nişan, tül, kurdele ve hediyelik sorgularını içeriyor.
