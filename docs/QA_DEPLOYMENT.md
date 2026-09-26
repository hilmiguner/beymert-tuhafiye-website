# QA & Deployment

Phase 12 release ve production kontrol referansı.

## 1. Otomatik kalite kapıları

### Lokal release check

```powershell
pnpm check
```

Sırasıyla:

- lint
- typecheck
- production build

çalıştırır.

### GitHub Actions

`.github/workflows/quality.yml` her pull request ve `main` push'unda:

- Node 22
- pnpm 11.15.1
- install
- lint
- typecheck
- build
- production server üzerinde CMS-aware smoke test

çalıştırır.

Repository'de lockfile henüz takip edilmediği için CI install adımı `--no-frozen-lockfile` kullanır. Production öncesi lockfile politikası ayrıca gözden geçirilebilir.

## 2. Lokal smoke / broken-link testi

Önce production build:

```powershell
pnpm build
pnpm start
```

İkinci bir PowerShell penceresinde:

```powershell
pnpm qa:smoke
```

Varsayılan target:

`http://localhost:3000`

Farklı target:

```powershell
$env:SMOKE_BASE_URL="https://example.com"
pnpm qa:smoke
```

Production CMS regression için önerilen ek kontroller:

```powershell
$env:SMOKE_BASE_URL="https://example.com"
$env:SMOKE_CANONICAL_ORIGIN="https://example.com"
$env:SMOKE_REQUIRE_ADMIN_AUTH="true"
$env:SMOKE_EXPECT_PATHS="/urunler/ornek-urun,/konseptler/ornek-konsept"
pnpm qa:smoke
```

`SMOKE_EXPECT_PATHS` virgülle ayrılmış opsiyonel bir listedir. Gerçek CMS içeriği değiştikçe örnek slug'lar güncellenebilir.

Smoke test:

- sitemap.xml'i okur
- sitemap'teki bütün route'ları açar
- CMS kaynaklı ürün/kategori/konsept detail route ailelerinin sitemap'te bulunduğunu doğrular
- opsiyonel `SMOKE_EXPECT_PATHS` ile belirli CMS route'larının sitemap'e gerçekten yansıdığını kontrol eder
- public HTML sayfalarında title, meta description, canonical ve Open Graph URL kontrolü yapar
- sitemap'te admin/preview gibi private route'ların bulunmadığını doğrular
- HTML sayfalarındaki internal linkleri keşfeder
- internal link status kodlarını kontrol eder
- robots.txt içinde sitemap ve `/admin` + `/preview` disallow kurallarını kontrol eder
- anonymous `/admin` isteğinin login/setup route'una yönlendirildiğini kontrol eder
- admin giriş/setup sayfasının `noindex` olduğunu doğrular
- temel security header'larını kontrol eder
- ana sayfada Türkçe `lang` ve JSON-LD structured data bulunduğunu kontrol eder
- bilinmeyen route'un 404 döndürdüğünü kontrol eder

## 3. Production environment

Production canonical origin:

`NEXT_PUBLIC_SITE_URL`

Vercel production environment'ta final domain ile tanımlanmalıdır.

Kontrol:

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://FINAL-DOMAIN"
pnpm qa:env
```

Script localhost, path/query/hash içeren veya geçersiz URL değerlerini reddeder.

## 4. Manuel viewport matrisi

Production öncesi kontrol:

| Hedef | Minimum kontrol |
| --- | --- |
| Küçük mobil | 334×715 |
| Standart mobil | 390×844 |
| Tablet | 768px |
| Breakpoint | 1024px |
| Desktop | 1366×768 |
| 1080p | 1920×1080 |
| Large desktop | 2560px genişlik |

Her viewport'ta:

- horizontal overflow
- navbar
- Hero
- kategori/konsept/product cards
- Scroll Story
- Gallery lightbox
- CTA'lar
- footer

kontrol edilir.

## 5. Browser / device matrisi

- Chrome desktop
- Edge desktop
- Safari iOS gerçek cihaz
- Chrome Android gerçek cihaz

Gerçek cihazda ayrıca:

- tel: link
- WhatsApp deep link
- swipe
- mobile menu
- fixed WhatsApp CTA
- scroll performance

kontrol edilir.

## 6. Vercel deployment sırası

1. GitHub repository Vercel'e bağlanır.
2. Framework preset Next.js olarak algılanır.
3. Node 22 kullanılır.
4. `NEXT_PUBLIC_SITE_URL` production environment'a eklenir.
5. İlk preview deployment alınır.
6. Preview üzerinde `SMOKE_BASE_URL` ile smoke test çalıştırılır.
7. Gerçek içerik / adres / saat doğrulaması tamamlanır.
8. Final domain bağlanır.
9. `NEXT_PUBLIC_SITE_URL` final domain'e çevrilir.
10. Production redeploy yapılır.
11. sitemap.xml / robots.txt / canonical kontrol edilir.
12. Lighthouse çalıştırılır.
13. Search Console'a property + sitemap eklenir.

## 7. Production smoke checklist

Deploy sonrası:

- ana sayfa 200
- ürün/kategori/konsept route'ları 200
- bilinmeyen URL 404
- sitemap gerçek domain kullanıyor
- robots gerçek domain kullanıyor
- canonical gerçek domain kullanıyor
- no console errors
- security headers mevcut
- WhatsApp linkleri
- telefon linki
- map/directions
- responsive
- reduced motion

## 8. Lighthouse hedefleri

Final gerçek medya ve production domain ile:

- Performance 90+
- Accessibility 95+
- Best Practices 95+
- SEO 95+

LCP, CLS ve INP ayrıca gözden geçirilir.

## 9. Phase 10 bağımlılığı

Production public launch öncesi hâlâ gerekli:

- final logo
- gerçek ürün/kategori/konsept listesi
- gerçek fotoğraflar
- işletme sahibinden kesin açık adres
- işletme sahibinden kesin çalışma saatleri

Teknik deployment yapılabilir; fakat bu içerikler doğrulanmadan public final release tamamlanmış sayılmaz.


## 10. QA execution status — 2026-09-21

Tamamlanan teknik kontroller:

- [x] Lokal `pnpm check`
- [x] GitHub Actions Quality Gate — lint + typecheck + build + production HTTP smoke
- [x] Vercel production deployment READY
- [x] Production `qa:smoke`
- [x] Sitemap route taraması
- [x] Internal link taraması
- [x] robots.txt kontrolü
- [x] Security header kontrolü
- [x] Intentional 404 kontrolü
- [x] CMS-aware sitemap route family kontrolü — smoke teste eklendi
- [x] Public metadata/canonical/OG URL kontrolü — smoke teste eklendi
- [x] Admin auth redirect + noindex kontrolü — smoke teste eklendi
- [x] robots admin/preview disallow kontrolü — smoke teste eklendi
- [x] Vercel runtime error kontrolü — son 24 saatte hata yok

Aktif manuel QA matrisi:

- [ ] Chrome desktop
- [ ] Edge desktop
- [ ] 334×715 küçük mobil
- [ ] 390×844 standart mobil
- [ ] 768px tablet
- [ ] 1920×1080 desktop
- [ ] 2560px large desktop
- [ ] Safari/iOS gerçek cihaz
- [ ] Chrome/Android gerçek cihaz
- [ ] Gerçek cihaz WhatsApp deep link
- [ ] Gerçek cihaz `tel:` link
- [ ] Mobile gallery swipe
- [ ] Mobile menu
- [ ] Fixed WhatsApp CTA
- [ ] Scroll performance

### Test sonucu raporlama

Her hedef için üç bilgi yeterli:

1. Hedef/browser/viewport
2. Sonuç: OK veya NOK
3. NOK ise kısa açıklama + mümkünse ekran görüntüsü

Browser/device QA bittikten sonra final domain, `NEXT_PUBLIC_SITE_URL`, Lighthouse ve Search Console aşamasına geçilir.
