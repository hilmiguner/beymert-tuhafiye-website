# Beymert Tuhafiye Website — Project Plan

> Bu doküman projenin ana planlama ve geliştirme referansıdır.
> Mimari, kapsam, tasarım ilkeleri ve roadmap kararları burada tutulur.
> Yeni geliştirmelere başlamadan önce bu dosya kontrol edilir; kapsam veya teknik karar değişirse önce bu dosya güncellenir.

## 1. Proje Özeti

Beymert Tuhafiye için e-ticaret içermeyen, mobil öncelikli, animasyonlu ve modern bir parti malzemeleri tanıtım/katalog sitesi geliştirilecektir.

Sitenin amacı doğrudan online satış yapmak değil; ziyaretçinin ürünleri, kategorileri ve parti konseptlerini keşfetmesini, mağazayı tanımasını ve WhatsApp / telefon / fiziksel mağaza üzerinden iletişime geçmesini sağlamaktır.

### Ana hedefler

- Beymert Tuhafiye'nin dijital vitrini olmak.
- Parti malzemelerini ve konseptleri güçlü görsellerle sergilemek.
- Ziyaretçiye kutlama/tema fikri vermek.
- Ürün keşfini kolaylaştırmak.
- WhatsApp, telefon ve mağaza ziyaretine dönüşümü artırmak.
- Mobil cihazlarda hızlı ve akıcı bir deneyim sunmak.
- Animasyonları dekoratif değil, içerik yönlendiren bir araç olarak kullanmak.

## 2. Kapsam

### V1 kapsamında

- Ana sayfa
- Ürün kataloğu
- Ürün detay sayfaları
- Kategori sayfaları
- Konsept listesi ve konsept detayları
- Galeri
- Hakkımızda
- Mağaza / iletişim bilgileri
- WhatsApp yönlendirmeleri
- Responsive ve mobile-first tasarım
- Animasyonlu hero ve seçilmiş scroll/micro interaction sahneleri
- Temel SEO, erişilebilirlik ve performans optimizasyonu

### V1 kapsamında olmayanlar

- Sepet
- Online ödeme
- Kullanıcı üyeliği / müşteri hesabı
- Sipariş yönetimi
- Kargo entegrasyonu
- Pazaryeri entegrasyonu
- Online stok rezervasyonu
- Kullanıcının harici bir servise giriş yapmasını gerektiren özellikler

Bu özellikler ihtiyaç oluşursa ayrı bir proje fazında değerlendirilir.

## 3. Kullanıcı Akışı

Temel ziyaretçi yolculuğu:

1. Ziyaretçi ana sayfaya gelir.
2. Marka ve mağaza atmosferini hero alanında görür.
3. Ürün kategorilerini veya parti konseptlerini keşfeder.
4. İlgilendiği ürün/konsept detayına geçer.
5. Galeri ve örnek kombinasyonlarla fikir edinir.
6. Ürün hakkında bilgi almak için WhatsApp'a gider veya mağaza iletişim bilgilerini kullanır.

Ana dönüşüm aksiyonları:

- Ürünleri Keşfet
- Konseptleri Keşfet
- WhatsApp'tan Sor
- Mağazayı Ziyaret Et / Yol Tarifi
- Telefonla Ara

## 4. Site Haritası

```text
/
├── /urunler
│   └── /urunler/[slug]
├── /kategoriler/[slug]
├── /konseptler
│   └── /konseptler/[slug]
├── /galeri
├── /hakkimizda
└── /iletisim
```

Ana sayfa içinde planlanan bölüm sırası:

1. Navbar
2. Hero
3. Ürün Kategorileri
4. Konseptler / "Partini Seç"
5. Öne Çıkan Ürünler
6. Animasyonlu Vitrin / Scroll Story
7. Özel Gününü Seç
8. Galeri
9. Neden Biz?
10. Mağaza / İletişim
11. Sosyal medya / Instagram vitrini
12. Final CTA
13. Footer

Bölüm sırası gerçek tasarım geliştirilirken kullanıcı deneyimine göre revize edilebilir.

## 5. Teknik Scaffold

### Ana teknoloji stack'i

- Next.js 16
- React 19
- TypeScript 6 compatibility package
- Tailwind CSS 4
- pnpm 11
- App Router

### Animasyon

- Motion
  - Component seviyesinde animasyonlar
  - Hover / tap
  - Enter / exit
  - Layout transition
  - Modal / lightbox
- GSAP
  - Hero timeline
  - Gelişmiş sahne animasyonları
  - Stagger ve text animation
- GSAP ScrollTrigger
  - Scroll-driven sahneler
  - Gerektiğinde pin / scrub
- Native browser scroll
  - Mobil ve desktopta varsayılan scroll davranışı korunur
  - Lenis prototip aşamasında değerlendirildi ancak kullanılmadığı için dependency kaldırıldı

### UI kaynakları

Temel UI sistemi:

- Tailwind CSS
- shadcn/ui yaklaşımı

Seçili özel bileşenler ihtiyaç halinde kaynak kod olarak alınabilir:

- Skiper UI
- Magic UI
- Aceternity UI

Kurallar:

- Hazır component birebir kopyalanmış template görünümü oluşturmamalı.
- Component proje design system'ine adapte edilmeli.
- Aynı görevi yapan birden fazla UI/animation dependency eklenmemeli.
- Kritik kullanıcı aksiyonları sadece hover davranışına bağlı olmamalı.

### 3D

Three.js / React Three Fiber V1'in zorunlu dependency'si değildir.

Yalnızca aşağıdaki durumda değerlendirilir:

- Gerçekten değer katan 3D ürün/balon sahnesi
- Performans bütçesi içinde çalışması
- Mobil fallback bulunması

## 6. Veri ve İçerik Mimarisi

İlk görsel geliştirme aşamasında mock/static data kullanılabilir.

Gerçek ürün yönetimi fazında planlanan içerik modeli:

### Product

- id
- slug
- name
- shortDescription
- description
- category
- images
- colors
- dimensions
- featured
- newArrival
- relatedProducts
- whatsappMessage

### Category

- id
- slug
- name
- description
- coverImage
- sortOrder

### Concept

- id
- slug
- name
- description
- coverImage
- gallery
- relatedProducts

### GalleryItem

- id
- image
- title
- description
- concept/category ilişkisi
- sortOrder

### StoreInfo

- address
- phone
- whatsapp
- openingHours
- map/directions
- socialLinks

İçerik yönetimi gerektiğinde öncelikli aday:

- Supabase

Supabase başlangıç scaffold'ına henüz eklenmez. Ürün/kategori/galeri verilerinin gerçek yönetim ihtiyacı netleştiğinde ayrı fazda entegre edilir.

## 7. Önerilen Kod Organizasyonu

Hedef klasör yapısı:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── urunler/
│   ├── kategoriler/
│   ├── konseptler/
│   ├── galeri/
│   ├── hakkimizda/
│   └── iletisim/
│
├── components/
│   ├── layout/
│   ├── sections/
│   ├── ui/
│   ├── motion/
│   └── shared/
│
├── data/
├── lib/
├── hooks/
├── types/
└── styles/
```

Kurallar:

- Page componentleri gereksiz büyütülmez.
- Section bazlı componentler `components/sections` altında tutulur.
- Tekrar kullanılabilir UI parçaları `components/ui` altında tutulur.
- Animasyon mantığı mümkün olduğunca presentation markup'tan ayrılır.
- İçerik ve component yapısı birbirinden ayrılır.
- Server Component varsayılan tercih olur.
- Client Component yalnızca interaktivite/animasyon gerektiğinde kullanılır.

## 8. Tasarım Yönü

Genel karakter:

- Renkli
- Enerjik
- Eğlenceli
- Sıcak
- Modern
- Düzenli
- Ürün odaklı

Kaçınılacak görünüm:

- Kurumsal yazılım şirketi
- Aşırı karanlık teknoloji sitesi
- Çocuk oyuncağı sitesi kadar kontrolsüz renk kullanımı
- Hazır template hissi
- Her elementin sürekli hareket ettiği yorucu animasyon tasarımı

### Görsel prensipler

- Açık / krem tabanlı ana zemin tercih edilebilir.
- Marka için 2-3 güçlü accent renk kullanılabilir.
- Büyük ve karakterli tipografi.
- Yuvarlatılmış ancak aşırı "bubble UI" olmayan kartlar.
- Gerçek ürün ve parti kurulum fotoğrafları tasarımın ana parçası olmalı.
- Dekoratif balon/konfeti öğeleri içerikle yarışmamalı.
- Fotoğraf kalitesi düşükse animasyonla gizlenmeye çalışılmamalı.

Final renk paleti ve typography ayrı design-system fazında kararlaştırılır.

## 9. Responsive / Mobil Strateji

Proje mobile-first geliştirilecektir.

Öncelik sırası:

1. Mobile
2. Tablet
3. Desktop
4. Large desktop

Desktop tasarım mobil ekrana küçültülmeyecek; her breakpoint aynı tasarım dilinin uygun varyasyonunu kullanacaktır.

### Mobil animasyon prensibi

Desktop:

- Daha güçlü parallax
- ScrollTrigger sahneleri
- Mouse interaction
- Daha fazla dekoratif hareket

Mobil:

- Native touch scroll
- Kısa fade / translate / stagger
- Daha az particle/dekoratif obje
- Gereksiz pinned section kullanılmaması
- Hover gerektiren davranışların tap karşılığı

### Accessibility

- `prefers-reduced-motion` desteklenir.
- Hareket azaltma tercihinde parallax / uzun timeline gibi hareketler kapatılır veya sadeleştirilir.
- Klavye navigasyonu korunur.
- Görsellere anlamlı alt text sağlanır.
- Renk kontrastları WCAG'e uygun tutulur.

## 10. Animasyon Kuralları

Animasyonun amaçları:

1. Dikkati yönlendirmek
2. İçerik hiyerarşisini anlatmak
3. Marka atmosferini güçlendirmek

Animasyon yoğunluğu:

- Fade / slide: sık
- Stagger: orta
- Text reveal: orta
- Hover/tap: sık fakat kısa
- Parallax: seçici
- Scroll pinning: maksimum birkaç özel bölüm
- 3D: yalnızca ihtiyaç varsa
- Particle/confetti: sınırlı
- Page transition: hafif

Aynı DOM elementinin transform değerleri GSAP ve Motion tarafından aynı anda yönetilmemelidir.

## 11. Performans Hedefleri

Hedef Lighthouse skorları:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Öncelikli Core Web Vitals:

- LCP
- CLS
- INP

Kurallar:

- Görseller Next/Image veya eşdeğer optimizasyonla sunulur.
- Büyük görseller responsive boyutlarda hazırlanır.
- Hero dışındaki ağır medya lazy-load edilir.
- WebGL/3D varsa dynamic import ve fallback kullanılır.
- Gereksiz client component oluşturulmaz.
- Animasyonda mümkün olduğunca transform ve opacity tercih edilir.
- Mobil düşük/orta seviye cihazlarda test yapılır.

## 12. SEO

Her önemli içerik kendi URL'ine sahip olmalıdır.

Planlanan SEO alanları:

- Türkçe title/description
- Open Graph metadata
- Canonical URL
- Sitemap
- robots.txt
- Product / LocalBusiness gibi uygun structured data
- Semantik heading yapısı
- Kategori ve konsept sayfalarında indekslenebilir gerçek açıklamalar
- Görsellerde açıklayıcı alt text

Yerel mağaza SEO'su, gerçek adres ve iletişim bilgileri geldiğinde ayrıca yapılandırılır.

## 13. WhatsApp Stratejisi

WhatsApp ana dönüşüm kanallarından biridir.

Ürün detay sayfasında mesaj önceden doldurulabilir:

```text
Merhaba, web sitenizde gördüğüm "[ÜRÜN ADI]" hakkında bilgi almak istiyorum.
```

Kurallar:

- Telefon numarası kod içine dağınık şekilde yazılmamalı.
- Merkezi site config içinde tutulmalı.
- CTA metinleri bağlama göre değişebilir.
- Mobilde WhatsApp aksiyonu kolay erişilebilir olmalı.
- Kullanıcı doğrudan sipariş verdiği izlenimine sokulmamalı; "bilgi al / sor" dili kullanılmalı.

## 14. Kalite Kapıları

Her geliştirme PR'ı merge edilmeden önce mümkün olduğunca:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

kontrollerinden geçmelidir.

Büyük UI değişikliklerinde ayrıca:

- Mobile kontrol
- Desktop kontrol
- Overflow kontrolü
- Keyboard navigation
- Reduced motion
- Console error/warning
- Link kontrolü

yapılır.

## 15. Git / Geliştirme Akışı

Ana branch:

- `main`

Yeni geliştirmeler için branch örnekleri:

- `feat/design-system`
- `feat/site-shell`
- `feat/hero`
- `feat/categories`
- `feat/concepts`
- `feat/products`
- `feat/gallery`
- `feat/contact`
- `feat/content-backend`
- `fix/mobile-navigation`
- `perf/image-optimization`

Tercih edilen süreç:

1. Roadmap'teki sıradaki iş seçilir.
2. Ayrı branch açılır.
3. Küçük ve anlamlı commitler yapılır.
4. PR açılır.
5. Lokal test yapılır.
6. Gerekirse PR üzerinde düzeltme yapılır.
7. Testler geçtikten sonra merge edilir.
8. Roadmap durumu güncellenir.

## 16. Roadmap

### Phase 0 — Foundation / Scaffold

Durum: TAMAMLANDI

- [x] GitHub repository oluşturuldu.
- [x] Next.js App Router scaffold oluşturuldu.
- [x] React + TypeScript kuruldu.
- [x] Tailwind CSS kuruldu.
- [x] Motion kuruldu.
- [x] GSAP kuruldu.
- [x] Lenis kuruldu.
- [x] pnpm güvenli build dependency politikası tanımlandı.
- [x] ESLint uyumluluğu sabitlendi.
- [x] TypeScript 6 compatibility yapılandırması tamamlandı.
- [x] `lint`, `typecheck`, `build`, `dev` lokal olarak doğrulandı.
- [x] İlk scaffold PR'ı merge edildi.

### Phase 1 — Brand & Design System

Durum: TAMAMLANDI

Amaç: Kodlamanın geri kalanında kullanılacak görsel sistemi belirlemek.

- [x] Logo / mevcut marka materyallerini değerlendirme — resmi sosyal hesaplar ve marka adı doğrulandı; yüksek kaliteli logo asset'i bulunamadığı için geçici text lockup kullanılıyor, kaynak logo geldiğinde değiştirilecek.
- [x] Ana renk paleti
- [x] Accent renkler
- [x] Typography
- [x] Spacing scale
- [x] Border radius sistemi
- [x] Shadow / border dili
- [x] Button varyantları
- [x] Link stilleri
- [x] Card sistemi
- [x] Container / grid sistemi
- [x] Responsive breakpoint kullanım kuralları
- [x] Motion duration/easing tokenları
- [x] Temel CSS design tokenlarının oluşturulması

Çıkış kriteri:

- Ana sayfanın tamamında kullanılabilecek tutarlı design system hazır olmalı.

### Phase 2 — Site Shell

Durum: TAMAMLANDI

- [x] Header / navbar
- [x] Mobile navigation
- [x] Global container
- [x] Footer
- [x] WhatsApp CTA altyapısı
- [x] Site config yapısı
- [x] Ortak metadata
- [x] Responsive navigation davranışı

Çıkış kriteri:

- Tüm sayfaların paylaşacağı ana kabuk tamamlanmalı.

### Phase 3 — Hero Experience

Durum: TAMAMLANDI

- [x] Hero copy
- [x] Ana CTA
- [x] Secondary CTA
- [x] Ürün/parti görsel kompozisyonu
- [x] GSAP giriş timeline
- [x] Dekoratif balon/konfeti hareketleri
- [x] Desktop pointer/parallax davranışı gerekiyorsa ekleme
- [x] Mobile sade animasyon varyantı
- [x] Reduced-motion varyantı
- [x] Hero performance kontrolü — production build, desktop ve 334px mobil QA doğrulandı.

Çıkış kriteri:

- İlk ekran markayı ve mağazanın ne sunduğunu birkaç saniye içinde açıklamalı.

### Phase 4 — Product Categories

Durum: TAMAMLANDI

- [x] Kategori veri modeli
- [x] Category card component
- [x] Responsive kategori grid/carousel
- [x] Hover/tap interactions
- [x] Ana sayfa kategori bölümü
- [x] `/kategoriler/[slug]` route
- [x] Boş/verisiz durumlar

### Phase 5 — Party Concepts

Durum: TAMAMLANDI

- [x] Concept veri modeli
- [x] "Partini Seç" ana sayfa bölümü
- [x] Concept cards
- [x] `/konseptler`
- [x] `/konseptler/[slug]`
- [x] Konsept galerisi
- [x] İlgili ürün bağlantıları — konsept detaylarında tekil ürün kartları ve ürün route bağlantıları aktif.
- [x] Mobil swipe/scroll davranışı

### Phase 6 — Product Catalog

Durum: TAMAMLANDI

- [x] Product veri modeli
- [x] `/urunler`
- [x] Product card
- [x] Product detail
- [x] Product gallery
- [x] Renk / ölçü gibi opsiyonel bilgiler
- [x] Featured / New ürün etiketleri
- [x] Related products
- [x] WhatsApp ürün mesajı
- [x] Kategori filtreleme
- [x] Mobil katalog deneyimi

Online fiyat/sepet/checkout eklenmeyecek.

### Phase 7 — Animated Showcase / Scroll Story

Durum: TAMAMLANDI

- [x] Sahne konseptini belirleme
- [x] ScrollTrigger prototipi
- [x] Ürün/dekoratif objelerin birleştiği vitrin sahnesi
- [x] Desktop timeline
- [x] Mobile simplified sequence
- [x] Reduced motion fallback
- [x] Performans testleri — production build ile desktop/mobile scroll ve viewport-fit QA doğrulandı.
- [x] JavaScript/reduced-motion durumunda uzun scroll track oluşturmayan statik fallback

Bu bölüm "wow effect" için vardır; kullanılabilirliği veya performansı düşürürse sadeleştirilir.

### Phase 8 — Gallery

Durum: TAMAMLANDI

- [x] Masonry/responsive gallery
- [x] Lightbox
- [x] Motion transitions
- [x] Concept/category ilişkileri
- [x] Görsel optimizasyonu — bu fazdaki temsili artwork remote image payload üretmiyor; gerçek fotoğraflar Phase 10'da Next/Image ile optimize edilecek.
- [x] Mobil gesture/tap davranışı

### Phase 9 — About, Trust & Store Contact

Durum: TAMAMLANDI — açık adres ve çalışma saatlerinin işletme sahibi doğrulaması Phase 10'a taşındı.

- [x] Hakkımızda içeriği
- [x] Neden Biz? bölümü
- [x] Mağaza bilgileri
- [ ] Tam açık adres — kaynaklar arasında çelişki var; Gemlik/Hamidiye seviyesi ve isim bazlı harita araması aktif, kapı numarası Phase 10 işletme sahibi doğrulamasıyla kilitlenecek.
- [x] Telefon
- [ ] Çalışma saatleri — public listing Pzt–Cmt 10:00–19:30 olarak işlendi; Phase 10'da işletme sahibiyle final doğrulama yapılacak.
- [x] WhatsApp
- [x] Yol tarifi — işletme adıyla güncel harita aramasına yönlendiriliyor.
- [x] Harita — işletme adıyla arama yapan lazy-loaded embed.
- [x] Final CTA
- [x] İletişim sayfası

### Phase 10 — Real Content & Content Management

Durum: GELİŞTİRMEDE — PR #11; gerçek içerik girişi işletme sahibi materyallerini bekliyor.

- [ ] Gerçek ürün listesini toplama
- [ ] Gerçek kategorileri tanımlama
- [ ] Gerçek konseptleri tanımlama
- [ ] Ürün fotoğraflarını optimize etme
- [ ] Mağaza bilgilerini doğrulama
- [x] Statik data mı Supabase mi kararını finalleştirme — V1 typed static content ile devam edecek.
- [x] Gerekiyorsa Supabase entegrasyonu — V1 için gerekmiyor; operasyonel içerik yönetimi ihtiyacı oluşursa yeniden değerlendirilecek.
- [x] Gerekiyorsa basit admin panel — V1 için gerekmiyor.
- [x] Image storage stratejisi — V1 için `public/media`, Next/Image ve typed media metadata; büyüme halinde object storage değerlendirilecek.
- [x] Product/Category/Concept/Gallery media fallback katmanı
- [x] Content relation integrity kontrolü

Admin panel yalnızca gerçek operasyon ihtiyacı varsa geliştirilir.

### Phase 11 — SEO, Accessibility & Performance

Durum: GELİŞTİRMEDE — PR #12

- [x] Metadata
- [x] Open Graph
- [x] Sitemap
- [x] robots.txt
- [x] Structured data — WebSite + LocalBusiness; doğrulanmamış sokak/kapı numarası ve çalışma saati schema'ya eklenmedi.
- [x] Alt text audit — gerçek media metadata'sında alt zorunlu; dekoratif artwork aria-hidden, ürün placeholder'ı anlamlı aria-label kullanıyor.
- [x] Heading audit — route sayfalarında tek ana H1 ve section bazlı H2/H3 yapısı korunuyor.
- [x] Keyboard navigation — skip link, mobile nav inert state, Escape desteği ve gallery dialog focus trap/restore.
- [x] Focus states — global focus-visible ring + skip link.
- [x] Contrast kontrolü — primary #D13F73 -> #D03D72 ile beyaz metin kontrastı AA sınırının üzerine çıkarıldı.
- [x] Reduced-motion audit — Hero, Scroll Story, Gallery, Product Catalog ve CSS transitions kontrol edildi.
- [x] Image audit — gerçek media Next/Image + sizes + lazy defaults; placeholder görseller bitmap payload üretmiyor.
- [x] Bundle audit — kullanılmayan Lenis dependency kaldırıldı; Motion ve GSAP yalnız etkileşimli bölümlerde kullanılıyor.
- [x] Core Web Vitals kod seviyesi optimizasyonu — static/SSG routes, responsive image layer, transform/opacity animation yaklaşımı ve ağır medya yok. Field ölçümü Phase 12'de.
- [ ] Lighthouse hedeflerinin kontrolü — production URL ve gerçek medya sonrası Phase 12'de ölçülecek.

### Phase 12 — QA & Deployment

- [ ] Chrome desktop
- [ ] Edge desktop
- [ ] Safari/iOS
- [ ] Chrome/Android
- [ ] Gerçek cihazda telefon ve WhatsApp link testi
- [ ] Küçük mobil ekran
- [ ] Tablet
- [ ] 1080p desktop
- [ ] Large desktop
- [ ] Broken link kontrolü
- [ ] Production build
- [ ] Environment variables
- [ ] Vercel deployment
- [ ] Domain bağlantısı
- [ ] Production smoke test
- [ ] Analytics kararı
- [ ] Search Console / sitemap gönderimi

## 17. Post-MVP Backlog

V1 sonrasında ihtiyaca göre değerlendirilebilir:

- Gelişmiş arama
- Ürün favorileme (hesapsız/local)
- Çoklu dil
- Kampanya landing page'leri
- Blog / parti fikirleri
- Instagram içerik senkronizasyonu
- Gelişmiş CMS/admin
- QR kampanya sayfaları
- 3D/WebGL hero
- Ürün videosu
- Müşteri yorumları
- Event-specific seasonal themes
- Analytics dashboard
- E-ticaret dönüşümü

## 18. Karar Kaydı

### Sabit kararlar

- Site e-ticaret sitesi değildir.
- V1'de sepet ve ödeme yoktur.
- Mobile-first geliştirilecektir.
- Animasyon stack'inin ana parçaları Motion + GSAP'tır.
- V1 native browser scroll kullanır; kullanılmayan Lenis dependency'si Phase 11'de kaldırılmıştır.
- Three.js zorunlu değildir.
- Hazır UI kitleri yalnızca kaynak/component havuzu olarak kullanılır.
- Kullanıcı harici bir servise login olmak zorunda kalmaz.
- WhatsApp ana iletişim/dönüşüm kanallarından biridir.
- Performans, animasyon gösterişinden daha yüksek önceliğe sahiptir.

### Henüz netleştirilecek kararlar

- Final logo kullanımı
- Final renk paleti
- Final font ailesi
- Gerçek kategori listesi
- Gerçek konsept listesi
- Gerçek ürün dataset'i
- Supabase gerekliliği
- Admin panel gerekliliği
- Domain
- Hosting production ayarları
- Analytics çözümü

---

Son güncelleme: 2026-09-19
