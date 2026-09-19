# Product Catalog

Phase 6 ürün katalog altyapısının referansıdır.

## Amaç

Bu site e-ticaret değildir. Product modeli:

- ürünü tanıtmak,
- kategori ve konseptlerle ilişkilendirmek,
- renk/ölçü gibi bilgileri göstermek,
- WhatsApp üzerinden bilgi alma akışını başlatmak

için kullanılır.

Fiyat, sepet ve checkout alanları bilinçli olarak yoktur.

## Product modeli

- slug
- name
- categorySlug
- conceptSlugs
- shortDescription
- description
- artworkKind
- colors
- dimensions
- featured
- newArrival
- sortOrder
- highlights

## Örnek veri

Phase 6'da 16 adet temsili ürün kaydı bulunur.

Bu kayıtlar gerçek mağaza envanteri değildir. Amaç route, filtre, kart, ilişki ve responsive katalog davranışlarını doğrulamaktır.

Phase 10'da:

- gerçek ürün listesi,
- gerçek isimler,
- güncel varyantlar,
- stok yaklaşımı,
- ürün fotoğrafları

doğrulanarak değiştirilir.

## ProductArtwork

Gerçek fotoğraflar bulunmadığı için ürünler hafif CSS tabanlı artwork kullanır ve kullanıcıya "Temsili görsel" etiketi gösterilir.

Gerçek fotoğraflar geldiğinde ProductCard ve route API'sini değiştirmeden Next/Image tabanlı asset alanına geçilebilir.

## Routes

- `/urunler`
- `/urunler/[slug]`

Ürün detayında:

- ana ürün bilgisi
- renk seçenekleri
- opsiyonel ölçü/uygulama bilgisi
- temsili gallery
- ilişkili konsept linkleri
- related products
- ürün ismi içeren WhatsApp CTA

bulunur.

## Filtering

`/urunler` sayfası client-side kategori filtresi kullanır.

Motion:

- filtre değişiminde layout transition
- enter/exit opacity + translate
- kısa ve düşük maliyetli animasyon

için kullanılır.

## Bağlantılar

Phase 6 ile:

- category -> products
- concept -> products
- product -> category
- product -> concepts
- product -> related products

ilişkileri çalışır hale gelir.
