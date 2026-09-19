# Product Categories

Phase 4 kategori sisteminin teknik ve içerik referansıdır.

## Veri modeli

Kategori verisi `src/data/categories.ts` içinde statik olarak tutulur.

Her kategori:

- slug
- name
- eyebrow
- shortDescription
- description
- accent
- accentSoft
- accentDark
- motif
- sortOrder
- highlights

alanlarını içerir.

Bu yapı daha sonra Supabase/CMS'e taşınabilecek şekilde componentlerden ayrılmıştır.

## İlk kategori seti

1. Balonlar
2. Doğum Günü
3. Baby Shower
4. Cinsiyet Partisi
5. Söz · Nişan · Düğün
6. Kına & Bekarlığa Veda
7. Kişiye Özel Hediyelik
8. Tül · Kurdele · Tuhafiye

Bu liste Beymert'in kamuya açık ürün/hizmet kapsamına göre başlangıç taxonomy'sidir. Gerçek operasyon envanteri geldiğinde revize edilebilir.

## Görsel yaklaşım

Gerçek ürün fotoğrafları henüz içerik sisteminde olmadığı için kategori kartları hafif inline/CSS artwork kullanır.

Avantajları:

- remote image dependency yok
- CLS riski düşük
- hızlı yükleme
- kategori kimlikleri birbirinden ayrılıyor
- gerçek görseller geldiğinde CategoryCard API'si değişmeden artwork değiştirilebilir

## Responsive davranış

Mobil:
- yatay snap scroll
- yaklaşık %82 viewport kart genişliği
- touch ile doğal kaydırma

Tablet/Desktop:
- 2 kolon
- geniş desktopta 4 kolon

## Route yapısı

- `/kategoriler`
- `/kategoriler/[slug]`

Dynamic route build sırasında mevcut kategoriler için statik parametre üretir.

## Empty state

Product Catalog fazı henüz tamamlanmadığı için kategori detayları ürün listesi yerine açık bir empty-state gösterir ve WhatsApp bilgi alma CTA'sı sunar.

Bu geçici durum kullanıcıya eksik/hatalı liste göstermekten daha güvenlidir.
