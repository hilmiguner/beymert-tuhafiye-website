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
