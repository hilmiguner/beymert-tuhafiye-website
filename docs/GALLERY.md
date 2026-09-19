# Gallery

Phase 8 galeri sisteminin teknik referansıdır.

## Amaç

Galeri yalnızca bağımsız fotoğraf listesi değildir. Her öğe:

- ürün,
- konsept,
- kategori

bağlamlarından biri veya birkaçıyla ilişkilendirilebilir.

Kullanıcı bir görselden doğrudan ilgili içerik sayfasına ilerleyebilir.

## Veri modeli

`GalleryItem`:

- id
- title
- description
- source
- aspect
- categorySlug
- conceptSlug
- productSlug
- featured
- sortOrder

alanlarını taşır.

`source`, Phase 8 boyunca gerçek fotoğraf yerine hangi temsili artwork'in kullanılacağını belirler.

## Responsive masonry

`/galeri`:

- mobil: 1 kolon
- tablet: 2 kolon
- desktop: 3 kolon

CSS columns + `break-inside-avoid` ile masonry benzeri doğal yükseklik akışı kullanır.

Kartların portrait, landscape, square ve wide varyantları vardır.

## Lightbox

Görsele tap/click:

- modal lightbox açar
- body scroll'u kilitler
- önceki/sonraki kontrolleri gösterir
- ilgili içerik linklerini gösterir

Keyboard:

- Escape: kapat
- ArrowLeft: önceki
- ArrowRight: sonraki

Mobile:

- görsele tap ile açılır
- yatay drag/swipe ile önceki/sonraki öğeye geçilir

## Motion

Motion yalnız:

- kartların viewport'a kısa girişinde
- lightbox enter/exit
- lightbox görsel değişiminde

kullanılır.

`prefers-reduced-motion` aktifse giriş ve modal transition süreleri kaldırılır.

## Görsel stratejisi

Phase 8 gerçek mağaza fotoğraflarını beklemez.

Şu anda:

- ProductArtwork
- ConceptArtwork

yeniden kullanılır ve her öğe açıkça "Temsili görsel" olarak belirtilir.

Bu yaklaşım remote image request, büyük bitmap payload veya CLS riski üretmez.

Phase 10'da GalleryItem modeline gerçek image asset alanı eklenecek ve Next/Image ile:

- responsive sizes
- lazy loading
- doğru aspect ratio
- optimize edilmiş formatlar

kullanılacaktır.

## Ana sayfa

Ana sayfada dört featured gallery item kısa vitrin olarak gösterilir ve tam `/galeri` sayfasına yönlendirir.
