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
├── /iletisim
├── /gemlik-parti-malzemeleri
├── /gemlik-tuhafiye
├── /bursa-parti-malzemeleri          # Phase 11.5 planlı
└── /bursa-tuhafiye                   # Phase 11.5 planlı
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
- [x] Fotoğraf tabanlı Scroll Story geliştirmesi — dört optimize edilmiş temsili konsept görseli, crossfade/scale geçişleri ve mobil fotoğraf kartları; gerçek işletme fotoğrafları geldiğinde değiştirilecek.

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

Durum: TAMAMLANDI — tam açık adres işletme sahibi tarafından doğrulandı; çalışma saatlerinin final doğrulaması Phase 10'da devam ediyor.

- [x] Hakkımızda içeriği
- [x] Neden Biz? bölümü
- [x] Mağaza bilgileri
- [x] Tam açık adres — işletme sahibi tarafından doğrulandı: Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa.
- [x] Telefon
- [ ] Çalışma saatleri — public listing Pzt–Cmt 10:00–19:30 olarak işlendi; Phase 10'da işletme sahibiyle final doğrulama yapılacak.
- [x] WhatsApp
- [x] Yol tarifi — doğrulanmış tam adres üzerinden harita aramasına yönlendiriliyor.
- [x] Harita — doğrulanmış tam adresi kullanan lazy-loaded embed.
- [x] Final CTA
- [x] İletişim sayfası

### Phase 10 — Real Content & CMS / Admin Panel

Durum: GELİŞTİRMEDE — CMS altyapısı, public Supabase veri geçişi ve RLS/authorization hardening tamamlandı; gerçek işletme içeriği, owner doğrulamaları ve final regression QA devam ediyor.

Amaç: Dükkan sahibinin GitHub/Vercel kullanmadan ürün, kategori, konsept, galeri, mağaza bilgileri ve görselleri güvenli bir admin panel üzerinden yönetebilmesi.

#### CMS roadmap

- [x] CMS mimarisini netleştirme — Next.js + Supabase Auth + PostgreSQL + Storage + RLS.
- [x] Supabase project/environment bağlantısı — `Beymert Tuhafiye` projesi `eu-central-1` bölgesinde oluşturuldu; database migration'ları canlı projede uygulandı; Vercel Preview/Production için Supabase public config değişkenleri tanımlandı.
- [x] Veritabanı schema + migration dosyaları — foundation + hardening migration'ları PR #16 ile eklendi ve canlı Supabase projesine uygulandı.
- [x] Storage bucket + medya güvenlik politikaları — `cms-media` bucket tanımı ve admin-only write policy'leri migration'a eklendi.
- [x] Admin authentication — Supabase email/password server action akışı ve owner/editor membership kontrolü eklendi; ilk doğrulanmış owner hesabı `hilmi.guner@hotmail.com` için oluşturuldu.
- [x] /admin korumalı route altyapısı — Next.js 16 `src/proxy.ts` ve server-side admin authorization eklendi.
- [x] Admin shell / dashboard — storefront'tan ayrılmış temel yönetim paneli kabuğu eklendi.
- [x] Kategori CRUD — listeleme, oluşturma, düzenleme, silme, sıralama ve draft/published/archived yönetimi canlı Supabase üzerinde E2E doğrulandı.
- [x] Ürün CRUD — listeleme, oluşturma, düzenleme, silme, kategori ilişkisi, özellikler ve yayın durumu canlı Supabase üzerinde E2E doğrulandı.
- [x] Ürün çoklu fotoğraf yükleme / sıralama / kapak seçimi — doğrudan Supabase Storage upload, RLS, atomik kapak seçimi ve medya temizliği canlı E2E doğrulandı; upload sonrası anlık UI güncellemesi de doğrulandı.
- [x] Konsept CRUD — listeleme, oluşturma, düzenleme, silme, ilgili ürün ilişkileri, sıralama ve yayın durumu canlı Supabase üzerinde E2E doğrulandı.
- [x] Konsept çoklu fotoğraf yükleme / sıralama / kapak seçimi — Storage upload, tek kapak constraint'i, atomik cover sync ve medya temizliği canlı E2E doğrulandı.
- [x] Galeri CRUD — oluşturma, düzenleme, silme, görsel yükleme/değiştirme, kategori/konsept ilişkisi, sıralama ve yayın durumu canlı Supabase üzerinde E2E doğrulandı; görsel önizleme state akışı da doğrulandı.
- [x] Rich-text ürün/konsept açıklama editörü — Tiptap tabanlı toolbar, aktif stil durumları, gerçek italic font yüzü, güvenli JSON doğrulama, `description_rich` saklama ve otomatik plain-text fallback canlı E2E doğrulandı.
- [x] Draft / published durum modeli — ortak draft/published/archived enum ve published_at davranışı kategori/ürün akışlarında aktif.
- [x] Önizleme akışı — `/preview` altında admin-only, noindex ürün/konsept/galeri önizleme route'ları, düzenlemeye dönüş, custom WhatsApp mesajları ve responsive medya görünümü canlı E2E doğrulandı.
- [x] Mağaza / site ayarları yönetimi — işletme/marka adı, konum, adres, telefon, WhatsApp, varsayılan mesaj, çalışma saatleri, harita sorgusu ve sosyal bağlantılar için singleton CMS ekranı eklendi; canlı E2E doğrulandı ve public site ayarları redeploy gerektirmeden kullanıyor.
- [x] Public site veri kaynağını typed static datadan Supabase'e taşıma — mağaza ayarları, kategoriler, ürünler, konseptler ve galeri published içerik modeliyle public siteye bağlandı; static veri yalnızca bağlantı/sorgu hatası fallback'i olarak tutuluyor.
- [x] Mevcut mock veriyi Supabase'e migrate etme — kategori, ürün ve konsept başlangıç verileri CMS'e taşındı; eski temsili galeri mockları public kaynak olmaktan çıkarıldı.
- [ ] Gerçek ürün listesini toplama.
- [ ] Gerçek kategorileri tanımlama.
- [ ] Gerçek konseptleri tanımlama.
- [ ] Gerçek ürün / konsept / galeri fotoğraflarını yükleme.
- [x] Açık adresi işletme sahibiyle doğrulama — Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa.
- [ ] Çalışma saatlerini işletme sahibiyle final doğrulama.
- [x] RLS / authorization güvenlik denetimi — public tabloların RLS/policy/grant yüzeyi denetlendi; anon grant'leri read-only seviyesine indirildi, CMS RPC execute izinleri anon'dan kaldırıldı, future postgres default privileges harden edildi ve draft medya metadata'sının anon tarafından listelenmesi engellendi. Supabase Security Advisor'da yalnız hesap seviyesindeki leaked-password-protection uyarısı kaldı.
- [ ] Dükkan sahibi gerçek kullanım testi.
- [ ] CMS sonrası public-site regression / SEO / performans QA.

#### CMS davranış kararları

- Public ziyaretçi için hesap sistemi eklenmez; Auth yalnızca admin panel içindir.
- Admin panel public navbar'da gösterilmez.
- İçerikler taslak olarak hazırlanabilir; yalnızca published içerikler public sitede görünür.
- Fotoğraflar Supabase Storage'da tutulur; metadata PostgreSQL'de tutulur.
- Service-role anahtarı browser/client bundle içine konmaz.
- Public site geçişi kontrollü yapılır; CMS foundation tamamlanana kadar mevcut typed static data çalışmaya devam eder.
- Rich-text içerik için Tiptap seçildi; canonical içerik `description_rich` JSONB alanında, SEO/fallback düz metin `description` alanında tutulur.
- İlk yetkilendirme modeli owner / editor rolleridir.
- Görsel yüklemelerinde JPEG/PNG/WebP/AVIF kabul edilir; boyut ve optimizasyon kuralları admin upload fazında uygulanır.

Çıkış kriteri:

- Dükkan sahibi ürün, kategori, konsept, galeri, medya ve temel mağaza bilgilerini panelden güvenli biçimde yönetebilmeli.
- Yayınlanan değişiklikler GitHub commit'i gerektirmeden public siteye yansımalı.

### Phase 11 — SEO, Accessibility & Performance

Durum: TAMAMLANDI — final Lighthouse ölçümü Phase 12 production QA kapsamında yapılacak.

- [x] Metadata
- [x] Open Graph
- [x] Sitemap
- [x] robots.txt
- [x] Structured data — WebSite + Store; işletme sahibi tarafından doğrulanan tam adres PostalAddress schema'sına bağlandı, çalışma saati mevcut CMS verisinden üretiliyor.
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

### Phase 11.5 — Local SEO Growth / Gemlik & Bursa

Durum: PLANLANDI — gerçek ürün/kategori içeriği toplu şekilde girilmeden önce uygulanacak öncelikli SEO geliştirme paketi.

Amaç: Beymert Tuhafiye'nin özellikle aşağıdaki ticari ve yerel arama niyetlerinde güçlü, ölçülebilir ve sürdürülebilir organik görünürlük kazanmasını sağlamak:

- `Gemlik Tuhafiye`
- `Gemlik Parti Malzemeleri`
- `Bursa Tuhafiye`
- `Bursa Parti Malzemeleri`

İkincil hedef sorgu kümeleri:

- Gemlik balon
- Gemlik helyumlu balon
- Gemlik doğum günü malzemeleri
- Gemlik doğum günü süsleri
- Gemlik baby shower malzemeleri
- Gemlik cinsiyet partisi malzemeleri
- Gemlik söz / nişan malzemeleri
- Gemlik tül
- Gemlik kurdele
- Gemlik hediyelik
- Bursa balon / doğum günü / özel gün ürünleri ile ilgili anlamlı uzun kuyruklu sorgular

#### Mevcut güçlü temel

- [x] `/gemlik-parti-malzemeleri` landing page
- [x] `/gemlik-tuhafiye` landing page
- [x] Ana sayfada Gemlik odaklı title / description
- [x] Page-level canonical URL
- [x] Open Graph metadata
- [x] Sitemap ve robots.txt
- [x] Breadcrumb JSON-LD
- [x] WebSite + Store structured data
- [x] Doğrulanmış tam adresin structured data'ya bağlanması
- [x] Kategori / ürün / konsept sayfalarının sitemap'e dahil edilmesi
- [x] Ana sayfadan yerel SEO landing page'lerine internal linking

#### On-page ve içerik geliştirmeleri

- [x] Tüm public route'larda title, meta description, H1, H2/H3 ve canonical audit'i — Phase 11.5 başlangıcında mevcut public route'lar gözden geçirildi; local SEO foundation iyileştirmeleri ayrı branch'te uygulandı.
- [x] `/gemlik-parti-malzemeleri` sayfası kategori niyeti, balon/doğum günü/baby shower/söz-nişan bağlantıları, Bursa ilişkili sayfa geçişi ve güncel ürün vitriniyle derinleştirildi.
- [x] `/gemlik-tuhafiye` sayfası tül/kurdele kullanım alanları, ilgili özel gün kategorileri, Bursa ilişkili sayfa geçişi ve güncel ürün vitriniyle güçlendirildi.
- [x] `/bursa-parti-malzemeleri` landing page oluşturma — Gemlik'teki gerçek mağaza konumu açıkça belirtilen, özgün içerikli sayfa eklendi.
- [x] `/bursa-tuhafiye` landing page oluşturma — Gemlik'teki gerçek mağaza konumu açıkça belirtilen, özgün tül/kurdele odaklı sayfa eklendi.
- [x] Bursa landing page'lerinde işletmenin fiziksel olarak Gemlik/Bursa'da olduğu açıkça belirtiliyor; Bursa merkezde mağaza varmış izlenimi oluşturulmuyor.
- [x] Bursa sayfaları Gemlik sayfalarının kopyası olarak üretilmedi; Bursa arama niyetine özel özgün açıklamalar, mağaza konumu ve kategori bağlantıları içeriyor.
- [x] Ana sayfadaki Local SEO bölümü Gemlik + Bursa landing page'lerine bağlanan dört kartlık internal-link yapısına genişletildi.
- [x] Kategori detay sayfaları yalnız ürün grid'i olmaktan çıkarıldı; kategori bazlı özgün metadata, Gemlik yerel bağlamı, mağaza bilgisi ve ilgili Gemlik/Bursa landing page bağlantıları eklendi.
- [ ] Gerçek ürün ve konseptler geldikçe kategori / local landing page / ürün / konsept arasındaki bağlamsal internal linking'i gerçek içerik üzerinden daha da genişletme — kategori ↔ local landing page temeli tamamlandı.
- [x] Local SEO landing page internal link anchor'ları bağlama göre çeşitlendirildi; exact-match tekrarına dayalı keyword stuffing kullanılmadı.
- [x] Gemlik ve Bursa local landing page'lerinde breadcrumb JSON-LD ve ilgili sayfa bağlantıları doğrulandı / eklendi.

#### Hedef içerik mimarisi

```text
/
├── /gemlik-parti-malzemeleri
├── /gemlik-tuhafiye
├── /bursa-parti-malzemeleri
├── /bursa-tuhafiye
├── /kategoriler/balonlar
├── /kategoriler/dogum-gunu
├── /kategoriler/baby-shower
├── /kategoriler/cinsiyet-partisi
├── /kategoriler/soz-nisan-dugun
├── /kategoriler/tul-kurdele-tuhafiye
├── /urunler/[slug]
└── /konseptler/[slug]
```

Gerçek arama talebi ve içerik kalitesi yeterli olduğunda değerlendirilebilecek rehber içerikler:

- `/rehber/gemlik-dogum-gunu-malzemeleri`
- `/rehber/helyumlu-balon-nedir`
- `/rehber/dogum-gunu-balon-secimi`
- `/rehber/baby-shower-malzemeleri`
- `/rehber/nisan-masasi-susleme`

Kural: yüksek adetli, düşük kaliteli veya yalnız anahtar kelime varyasyonu için üretilmiş SEO sayfaları oluşturulmaz. Az sayıda, özgün ve faydalı içerik tercih edilir.

#### Local SEO / Google Business Profile / NAP

- [ ] Google Business Profile ana kategori ve uygun ikincil kategorileri doğrulama.
- [ ] Google Business Profile işletme adı, adres, telefon, web sitesi ve çalışma saatlerini final bilgilerle eşitleme.
- [ ] Google Business Profile'a gerçek mağaza / ürün / vitrin fotoğrafları ekleme ve güncel tutma.
- [ ] Gerçek müşteri yorumlarını doğal şekilde teşvik etme; yorum satın alma veya manipülatif yorum toplama yapılmaz.
- [ ] Gelen Google yorumlarına düzenli ve doğal yanıt verme.
- [ ] İnternetteki temel işletme kayıtlarında NAP tutarlılığı sağlama: Name / Address / Phone.
- [x] Eski veya çelişkili adres kayıtları tespit edildi — Yandex `Hamidiye Mah., Irmak Sok., No:32/1C`; güncel harita/business kaydı `Hamidiye, Kuvayi Milliye Bl. 2/A` gösteriyor. Sitenin işletme sahibi tarafından doğrulanmış canonical adresi `Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa`. Harici platform düzeltmeleri açık iş olarak devam ediyor.
- [x] Yandex ve görünür harita/business kayıtları kontrol edildi; adres tutarsızlığı doğrulandı. Düzeltme işlemleri ilgili platform hesaplarından yapılacak.
- [ ] Site, Google Business Profile ve harita/dizin kayıtlarında canonical işletme adı, tam adres ve telefon bilgisini aynı standarda getirme — telefon `+90 543 337 70 04` kaynaklarda tutarlı; adres standardizasyonu hâlâ açık.

Canonical açık adres:

`Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa`

#### Structured data geliştirmeleri

- [ ] Store JSON-LD için gerçek koordinatlar doğrulandıktan sonra `geo.latitude` ve `geo.longitude` ekleme.
- [ ] Gerçek mağaza görselleri geldikten sonra uygun `image` alanlarını ekleme.
- [ ] Final logo asset'i geldiğinde structured data ve metadata tarafında logo kullanımını değerlendirme.
- [ ] Çalışma saatleri owner tarafından final doğrulandıktan sonra `openingHoursSpecification` doğruluğunu tekrar kontrol etme.
- [ ] Sosyal hesaplar doğrulandıkça `sameAs` listesini eksiksiz tutma.
- [ ] Gerçek ürün datası tamamlandığında uygun ürün sayfalarında Product structured data değerlendirme / uygulama.
- [ ] Structured data değişikliklerini Google Rich Results / schema doğrulama araçlarıyla kontrol etme.

#### Görsel SEO

- [ ] Gerçek ürün, mağaza ve konsept fotoğraflarında açıklayıcı ve doğal alt text kullanma.
- [ ] Dosya adlarını mümkün olduğunca anlamlı tutma.
- [ ] Görsel boyut / format / responsive `sizes` ve Next/Image optimizasyonunu gerçek içerik sonrası tekrar audit etme.
- [ ] Aynı görselin gereksiz tekrar kullanımını ve düşük kaliteli placeholder içeriğini azaltma.

#### Search Console ve ölçüm

- [x] Google Search Console Domain property doğrulandı.
- [x] Sitemap gönderildi; gönderim sırasında 0 hata / 0 uyarı doğrulandı.
- [x] Beymert Search Console property'si analiz entegrasyonunda kullanılabilir hale getirildi — `sc-domain:beymerttuhafiye.com`; inspection ve performance read erişimi doğrulandı.
- [x] Ana hedef sorgular için başlangıç baseline'ı kaydedildi — 2026-08-31–2026-09-27 aralığında `Gemlik Tuhafiye`, `Gemlik Parti Malzemeleri`, `Bursa Tuhafiye`, `Bursa Parti Malzemeleri`: 0 impression / 0 click; görünürlük henüz oluşmamış.
- [x] `Gemlik Tuhafiye`, `Gemlik Parti Malzemeleri`, `Bursa Tuhafiye`, `Bursa Parti Malzemeleri` ve ikincil local sorgular için `Beymert Local SEO Targets` Search Console topic cluster'ı oluşturuldu; düzenli performans takibi bu küme üzerinden yapılacak.
- [x] Local landing page index durumu URL Inspection ile doğrulandı — ana sayfa + `/gemlik-parti-malzemeleri` + `/gemlik-tuhafiye` `Submitted and indexed`; yeni Bursa landing page'leri 2026-09-30 itibarıyla `URL is unknown to Google`.
- [ ] Deployment / içerik değişiklikleri sonrası query ve landing-page bazında performans karşılaştırma.
- [ ] Düşük CTR alan ancak iyi impression/position üreten sayfalarda title / description testleri yapma.
- [ ] Cannibalization kontrolü: aynı sorgu için birden fazla sayfanın birbirinin sinyalini zayıflatıp zayıflatmadığını izleme.

#### Teknik SEO / kalite kapısı

- [x] Yeni Bursa local landing page'leri sitemap'e eklendi.
- [x] Canonical URL'ler production host `https://www.beymerttuhafiye.com` üzerinde doğrulandı — Gemlik/Bursa local landing page'leri ve kritik kategori sayfaları 200 + doğru canonical + `index, follow` + tek H1 ile canlıda kontrol edildi.
- [x] robots / noindex davranışı otomatik smoke test ile korunuyor; public sitemap route'larında noindex reddediliyor, admin/preview robots kuralları doğrulanıyor.
- [x] Broken internal link kontrolü otomatik smoke testin sitemap crawl ve discovered internal-link taramasıyla korunuyor.
- [x] Duplicate title / duplicate description audit'i — production smoke test sitemap genelinde benzersizlik kontrolü yapacak şekilde genişletildi.
- [x] Heading hierarchy audit'i — mevcut route auditine ek olarak smoke test her public sitemap route'unda tam bir H1 zorunluluğunu otomatik doğruluyor.
- [ ] Mobil ve desktop render / content parity kontrolü.
- [ ] Final Lighthouse SEO hedefi: 95+.
- [ ] Gerçek medya sonrası Core Web Vitals etkisini tekrar ölçme.

#### Uygulama sırası

1. Mevcut metadata / heading / canonical / internal-link audit'i.
2. Gemlik landing page'lerini derinleştirme.
3. Bursa Parti Malzemeleri landing page'i.
4. Bursa Tuhafiye landing page'i.
5. Ana sayfa local SEO ve internal-link güncellemesi.
6. Structured data geliştirmeleri.
7. Kategori sayfalarının SEO içeriğini güçlendirme.
8. Sitemap / breadcrumb / internal-link finalizasyonu.
9. Google index kontrolü.
10. Gerçek ürünler girildikçe ürün/kategori/konsept sinyallerini local landing page'lere bağlama.
11. Search Console verisi yeterli hale geldikçe sorgu bazlı iterasyon.

#### Başarı ölçütü

Amaç tek başına belirli bir sıra numarasını garanti etmek değildir. Başarı aşağıdaki metriklerle ölçülür:

- hedef sorgularda artan impressions
- hedef sorgularda yükselen organik clicks
- iyileşen CTR
- zaman içinde daha iyi average position
- local landing page'lerin doğru şekilde indexlenmesi
- Google Business Profile / web sitesi / dizinler arasında NAP tutarlılığı
- organik aramadan WhatsApp, telefon ve mağaza ziyareti niyetinin artması

### Phase 12 — QA & Deployment

Durum: QA DEVAM EDİYOR — production deployment ve smoke test tamamlandı; browser/gerçek cihaz matrisi aktif.

- [ ] Chrome desktop
- [ ] Edge desktop
- [ ] Safari/iOS
- [ ] Chrome/Android
- [ ] Gerçek cihazda telefon ve WhatsApp link testi
- [ ] Küçük mobil ekran
- [ ] Tablet
- [ ] 1080p desktop
- [ ] Large desktop
- [x] Broken link kontrolü — production `qa:smoke` testi geçti.
- [x] Production build — lokal `pnpm check` ve GitHub Actions Quality Gate geçti.
- [ ] Environment variables — contract ve `qa:env` doğrulaması hazır; final domain değeri deployment sırasında girilecek.
- [x] Vercel deployment — `beymert-tuhafiye-website.vercel.app` production deployment READY.
- [x] Domain bağlantısı — `beymerttuhafiye.com` ve `www.beymerttuhafiye.com` production'a bağlı; apex → www 308 doğrulandı.
- [x] Production smoke test — canlı Vercel URL üzerinde `Smoke test PASSED`.
- [ ] Analytics kararı
- [x] Search Console / sitemap gönderimi — Domain property doğrulandı; sitemap 0 hata / 0 uyarı ile gönderildi.

## 17. Post-MVP Backlog

V1 sonrasında ihtiyaca göre değerlendirilebilir:

- Gelişmiş arama
- Ürün favorileme (hesapsız/local)
- Çoklu dil
- Kampanya landing page'leri
- Blog / parti fikirleri
- Instagram içerik senkronizasyonu
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
- Yerel SEO'nun ana hedefleri Gemlik'te parti malzemeleri/tuhafiye sorguları; ikincil genişleme hedefleri Bursa parti malzemeleri/tuhafiye sorgularıdır.
- Bursa SEO sayfaları işletmenin Gemlik'teki gerçek konumunu açıkça belirtir; yanıltıcı şehir/mağaza konumu sinyali üretilmez.
- Local SEO başarısı yalnız sıralamayla değil Search Console görünürlüğü, CTR, index durumu, NAP tutarlılığı ve dönüşüm niyetiyle ölçülür.
- Ürün ve konsept bazında özel WhatsApp mesajı tanımlanabilir; boş bırakılırsa varsayılan bağlamsal mesaj kullanılır.
- Performans, animasyon gösterişinden daha yüksek önceliğe sahiptir.

### Henüz netleştirilecek kararlar

- Final logo kullanımı
- Final renk paleti
- Final font ailesi
- Gerçek kategori listesi
- Gerçek konsept listesi
- Gerçek ürün dataset'i
- Domain — `beymerttuhafiye.com` satın alındı; Vercel bağlantısı ve HTTPS doğrulandı. Canonical host `www.beymerttuhafiye.com`, apex → www 308.
- Hosting production ayarları
- Analytics çözümü

---

Son güncelleme: 2026-09-30
