# Party Concepts

Phase 5 konsept katmanının teknik ve içerik referansıdır.

## Konsept ile kategori farkı

Kategori, ürünün ne olduğunu söyler:

- Balon
- Doğum günü
- Hediyelik
- Tuhafiye

Konsept ise ürünlerin birlikte nasıl görüneceğini söyler:

- Safari Party
- Pink & Gold
- Bride to Be

Bu yüzden konseptler kategorilerden ayrı bir veri modeli olarak tutulur.

## Concept modeli

- slug
- name
- eyebrow
- shortDescription
- description
- motif
- colors
- relatedCategorySlugs
- gallery
- sortOrder

## Başlangıç konseptleri

1. Safari Party
2. Prenses Partisi
3. Unicorn Party
4. Futbol Partisi
5. Pink & Gold
6. Blue & Silver
7. Soft Baby Shower
8. Bride to Be

Bu liste başlangıç tasarım taxonomy'sidir. Phase 10'da gerçek mağaza operasyonu ve mevcut konsept fotoğraflarıyla doğrulanıp revize edilebilir.

## Görsel yaklaşım

Gerçek konsept fotoğrafları henüz repository'de olmadığı için ConceptArtwork ile temanın:

- renk paleti
- balon/dekor hissi
- masa
- detay

varyasyonları temsil edilir.

Gerçek fotoğraflar geldiğinde veri modeline image/gallery asset alanları eklenebilir; route ve card API'sinin değişmesi gerekmez.

## Ana sayfa

"Partini Seç" bölümü:

- mobilde yatay snap scroll
- tablet ve desktopta grid
- konsept kartına doğrudan route

kullanır.

## Detail route

`/konseptler/[slug]`:

- konsept hero
- 3 sahnelik konsept galerisi
- ilişkili kategori kartları
- WhatsApp CTA
- Product Catalog tamamlanana kadar ürün eşleştirmesi empty-state'i

içerir.

## Ürün ilişkisi

Şu anda konsept -> kategori ilişkisi gerçek linklerle aktiftir.

Konsept -> tekil ürün ilişkisi Phase 6'da Product veri modeli ortaya çıktığında eklenecektir.
