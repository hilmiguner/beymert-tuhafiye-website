# Product Catalog

Ürün katalog altyapısının güncel referansıdır.

## Amaç

Site e-ticaret değildir. Product modeli:

- ürünü tanıtır,
- bir veya daha fazla kategoriyle ilişkilendirir,
- konseptlerle ilişkilendirir,
- renk/ölçü gibi bilgileri gösterir,
- WhatsApp üzerinden bilgi alma akışını başlatır.

Fiyat, sepet ve checkout alanları bilinçli olarak yoktur.

## Çoklu kategori modeli

Ürün-kategori ilişkileri `public.product_categories` join tablosunda tutulur:

- `product_id`
- `category_id`

Bir ürün birden fazla kategoriye bağlanabilir.

Eski `products.category_id` alanı geriye uyumluluk amacıyla korunur. CMS
`set_product_categories` RPC'sini kullandığında seçilen ilk kategori bu alana
da yazılır. Public katalog ve kategori filtrelemesi esas olarak çoklu ilişki
tablosunu kullanır.

Migration sırasında eski `products.category_id` değerlerinin tamamı
`product_categories` tablosuna backfill edilmiştir; mevcut ürün-kategori
bağlantıları kaybolmaz.

## CMS davranışı

Ürün oluşturma/düzenleme formu kategori ağacını:

- ana kategori,
- alt kategori,
- üçüncü seviye kategori

şeklinde hiyerarşik checkbox listesi olarak gösterir.

Ürün:

- kategorisiz bırakılabilir,
- tek kategoriye bağlanabilir,
- birden fazla kategoriye bağlanabilir.

Düzenleme ekranında mevcut ilişkiler otomatik seçili gelir.

## Public katalog

`/urunler` kategori filtreleri üç seviyeli ağacı kullanır.

Bir ana kategori seçildiğinde:

- doğrudan o kategoriye bağlı ürünler,
- alt kategorilerine bağlı ürünler,
- üçüncü seviye alt kategorilerine bağlı ürünler

birlikte filtrelenir.

Bir ürün birden fazla kategoriye bağlıysa ilgili kategori dallarının her birinde
görünebilir.

Ürün detay sayfası ana kategori breadcrumb yolunu korur ve ürün birden fazla
kategoriye bağlıysa diğer kategori bağlantılarını da gösterir.

## Diğer ilişkiler

Konsept ilişkileri `product_concepts`, medya ilişkileri `product_media`
üzerinden çalışmaya devam eder. Çoklu kategori geliştirmesi bu ilişkilerin veri
modelini değiştirmez.

## Gerçek içerik

Mevcut içerik migration sırasında korunmuştur. Phase 10 kapsamında gerçek ürün,
kategori, konsept ve fotoğraflar CMS'e girildikçe temsili/fallback içerik
kademeli olarak kaldırılacaktır.
