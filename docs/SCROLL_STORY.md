# Animated Showcase / Scroll Story

Phase 7 ana sayfa vitrin sahnesinin teknik referansıdır.

## Sahne fikri

Scroll story bir kutlamanın dört katmanda şekillenmesini anlatır:

1. Atmosferi kur
2. Parçaları birleştir
3. Konsepti kişiselleştir
4. Son dokunuşu yap

Amaç yalnızca dekoratif hareket göstermek değil; Beymert'in parti, konsept ve tuhafiye ürünlerinin birlikte nasıl bütünlüklü bir kutlama atmosferine dönüşebileceğini göstermektir.

## Görsel medya

Scroll Story artık saf CSS artwork yerine dört optimize edilmiş WebP konsept görseli kullanır:

- `/media/scroll-story/scene-01-birthday.webp`
- `/media/scroll-story/scene-02-balloons.webp`
- `/media/scroll-story/scene-03-baby-shower.webp`
- `/media/scroll-story/scene-04-supplies.webp`

Görseller 960×720 çözünürlükte web için optimize edilmiştir. Bunlar gerçek mağaza kurulumu veya doğrulanmış ürün envanteri değildir; gerçek işletme fotoğrafları gelene kadar profesyonel geçici konsept medyasıdır. Bu nedenle arayüzde "Temsili konsept görseli" etiketi gösterilir.

Gerçek Beymert fotoğrafları geldiğinde aynı dosya yolları veya aynı veri modeli üzerinden değiştirilebilir.

## Desktop davranışı

1024px ve üzeri, reduced-motion kapalı cihazlarda:

- uzun scroll track yalnızca JavaScript enhancement sonrası aktif olur
- sahne CSS sticky ile viewport içinde kalır
- GSAP ScrollTrigger scroll ilerlemesini timeline'a bağlar
- soldaki dört anlatım adımı sırayla crossfade olur
- sağdaki dört fotoğraf opacity + scale ile birbirine geçer
- fotoğraflarda çok hafif zoom/depth hareketi bulunur
- layout, blur veya ağır filtre değerleri scroll sırasında animate edilmez

Dört sahne nedeniyle enhanced track 400vh kullanır.

## Mobile davranışı

1024px altı cihazlarda pinned/sticky uzun scroll sahnesi kullanılmaz.

Aynı hikaye:

- dört ayrı fotoğraf kartı
- native touch scroll
- kısa fade + translate girişleri

ile sunulur. Görseller Next/Image üzerinden lazy-load edilir.

## Reduced motion

`prefers-reduced-motion: reduce` durumunda:

- scrub timeline kurulmaz
- mobil entrance animasyonları kurulmaz
- uzun desktop track aktif olmaz
- bütün metin içeriği statik ve okunabilir kalır
- desktop görsel alanında ilk konsept görseli statik olarak gösterilir

## JavaScript fallback

Desktop track'in 400vh yüksekliği markup/CSS varsayılanı değildir.

Bu yükseklik yalnızca ScrollTrigger kurulabildiğinde `data-enhanced="true"` ile etkinleşir. JavaScript çalışmazsa kullanıcı gereksiz uzun boş bir scroll alanı görmez.

## Performance yaklaşımı

- dört WebP asset toplam payload'ı düşük tutulur
- Next/Image responsive output üretir
- mobilde görseller native lazy-load davranışını kullanır
- desktop animasyonu yalnız transform + opacity kullanır
- video, canvas, WebGL ve Three.js kullanılmaz

## QA

Merge öncesi özellikle:

- 334–390px mobile native scroll
- 768px tablet
- 1024px breakpoint geçişi
- 1366/1440 desktop scrub
- hızlı scroll
- geri scroll
- dört görselin doğru sırayla crossfade olması
- temsili görsel etiketinin okunabilirliği
- reduced-motion
- production build

kontrol edilmelidir.
