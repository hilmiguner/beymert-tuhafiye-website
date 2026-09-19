# Animated Showcase / Scroll Story

Phase 7 ana sayfa vitrin sahnesinin teknik referansıdır.

## Sahne fikri

Scroll story tek bir kutlamanın üç aşamada oluşmasını anlatır:

1. Rengi seç
2. Parçaları birleştir
3. Son dokunuşu yap

Amaç yalnızca dekoratif hareket göstermek değil; Beymert'in kategori, konsept ve ürün yapısının birlikte nasıl bir kutlama atmosferine dönüştüğünü anlatmaktır.

## Desktop davranışı

1024px ve üzeri, reduced-motion kapalı cihazlarda:

- uzun scroll track yalnızca JavaScript enhancement sonrası aktif olur
- sahne CSS sticky ile viewport içinde kalır
- GSAP ScrollTrigger scroll ilerlemesini timeline'a bağlar
- soldaki üç anlatım adımı sırayla vurgulanır
- sağdaki vitrin renk paletinden tamamlanmış sahneye dönüşür

Animasyonlar ağırlıklı olarak:

- transform
- opacity

üzerinden çalışır.

Box-shadow, blur veya layout değerleri scroll sırasında animate edilmez.

## Mobile davranışı

1024px altı cihazlarda pinned/sticky uzun scroll sahnesi kullanılmaz.

Aynı hikaye:

- üç ayrı kart
- native touch scroll
- kısa fade + translate girişleri

ile sunulur.

Bu sayede dar ekranlarda scroll kontrolü kullanıcıda kalır.

## Reduced motion

`prefers-reduced-motion: reduce` durumunda:

- scrub timeline kurulmaz
- mobil entrance animasyonları kurulmaz
- uzun desktop track aktif olmaz
- bütün içerik statik ve okunabilir kalır

## JavaScript fallback

Desktop track'in 300vh yüksekliği markup/CSS varsayılanı değildir.

Bu yükseklik yalnızca ScrollTrigger kurulabildiğinde `data-enhanced="true"` ile etkinleşir. JavaScript çalışmazsa kullanıcı gereksiz uzun boş bir scroll alanı görmez.

## Performance yaklaşımı

Bu faz:

- remote image
- video
- canvas
- WebGL
- Three.js

kullanmaz.

Sahne saf HTML/CSS şekillerinden oluşur. Gerçek ürün fotoğrafları ileride eklense bile scroll animasyon katmanının bağımsız kalması hedeflenir.

## QA

Merge öncesi özellikle:

- 334–390px mobile native scroll
- 1024px breakpoint geçişi
- 1366/1440 desktop scrub
- hızlı scroll
- geri scroll
- reduced-motion
- production build

kontrol edilmelidir.
