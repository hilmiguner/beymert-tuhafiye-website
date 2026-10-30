# Product Catalog

Ürün katalog altyapısının güncel referansıdır.

## Amaç

Site e-ticaret değildir. Product modeli:

- ürünü tanıtır,
- bir veya daha fazla kategoriyle ilişkilendirir,
- konseptlerle ilişkilendirir,
- renk ve renk serilerini merkezi katalogdan seçer,
- yalnız gerçek renk-seri kombinasyonlarını müşteriye sunar,
- ürün ve varyant görsellerini yönetir,
- WhatsApp üzerinden bilgi alma akışını başlatır.

Fiyat, sepet, stok rezervasyonu ve checkout bilinçli olarak yoktur.

## Çoklu kategori modeli

Ürün-kategori ilişkileri `public.product_categories` join tablosunda tutulur.
Bir ürün birden fazla kategoriye bağlanabilir. Eski `products.category_id`
alanı geriye uyumluluk amacıyla korunur; seçilen ilk kategori bu alana da
yazılır.

Kategori sistemi en fazla üç seviyedir. Parent kategori sayfaları alt
kategorilere bağlı ürünleri de kapsar.

## Merkezi renk kataloğu

Renkler artık ürün formunda serbest metin olarak yazılmaz.

`public.colors` merkezi renk kataloğudur. Başlangıç kataloğu:

- 44 sabit renk,
- dört grup: Temel, Özel Tonlar, Metalik/Krom, Diğer,
- opsiyonel HEX renk değeri,
- case-insensitive benzersiz renk adı.

Admin `/admin/renkler` ekranından yeni renk ekleyebilir. Aynı renk adı ikinci
kez eklenemez.

Yeni ürünler hiçbir renk seçili olmadan başlar. Düzenleme ekranında ürünün daha
önce seçilmiş renkleri otomatik olarak işaretli gelir.

Eski `products.colors` text[] alanı geriye uyumluluk için korunur ve yeni
ilişki kayıtlarıyla senkron tutulur.

### Mevcut veri migrasyonu

Migration sırasında mevcut ürün renkleri silinmedi:

- eski renk girdisi: 93
- yeni `product_colors` ilişkisi: 93
- eksik aktarım: 0

Sabit 44 renk listesinde bulunmayan eski değerler özel renk olarak kataloğa
eklenerek korundu. Örnek: Vizon, Doğal, Pudra, Pembe Krom ve benzeri eski
değerler.

## Renk serileri

`public.color_series` altı sabit seri içerir:

1. Standart (Klasik)
2. Makaron
3. Retro
4. Neon
5. Metalik
6. Krom

Ürün formunda renklerden bağımsız olarak birden fazla seri seçilebilir.

## Geçerli renk-seri kombinasyonları

Bir üründe renk ve seri seçilmiş olması tüm kartezyen kombinasyonların mevcut
olduğu anlamına gelmez.

`public.product_color_variants` yalnız gerçek kombinasyonları tutar:

- product
- color
- optional series
- optional media/image
- sort order

CMS ürün düzenleme sayfasındaki kombinasyon yöneticisinde geçerli eşleşmeler
tek tek işaretlenir.

Örnek:

- Kırmızı + Standart
- Pembe + Makaron
- Yeşil + Retro
- Turuncu + Neon
- Mavi + Metalik
- Gold + Krom

Bir kombinasyona ürüne yüklenmiş ayrı fotoğraf bağlanabilir. Public ürün
sayfasında müşteri rengi/seriyi seçtiğinde bağlı görsel varsa ana görsel sayfa
yenilenmeden değişir.

### Tekrarlı seçenek normalizasyonu

Public UI aşağıdaki eşdeğer gösterimleri tek seçeneğe indirger:

- Metalik Kırmızı ≡ Kırmızı + Metalik
- Krom Gold ≡ Gold + Krom
- Krom Silver ≡ Silver + Krom
- Krom Rose Gold ≡ Rose Gold + Krom

Aynı yaklaşım eski Pembe Krom / Gümüş Krom / Altın Krom verilerine de
uygulanır.

## Ürün fotoğrafları

`product_media` ilişkisi:

- sınırsız sayıda ürün fotoğrafı,
- sıra,
- kapak seçimi,
- fotoğraf açıklaması (`caption`)

tutar.

Her fotoğraf açıklaması bağımsızdır. Boş caption public sitede hiçbir metin
üretmez.

Public ürün detayında:

- tüm fotoğraflar gösterilir,
- fotoğraflar kırpılmadan `contain` ile sunulur,
- fotoğraf açıklaması varsa altında görünür,
- görsele tıklanınca lightbox açılır,
- lightbox'ta önceki/sonraki ve klavye navigasyonu bulunur.

## CMS davranışı

Ürün formunda:

- kategori hiyerarşik çoklu seçimdir,
- renkler aranabilir ve gruplandırılmış çoklu seçimdir,
- renk serileri ayrı çoklu seçimdir,
- yeni ürün renk/seri açısından boş başlar,
- mevcut seçimler düzenlemede korunur.

Ürün kaydedildikten sonra:

- fotoğraflar yüklenir/sıralanır,
- caption düzenlenir,
- kapak seçilir,
- geçerli renk-seri kombinasyonları tanımlanır,
- gerektiğinde kombinasyonlara fotoğraf bağlanır.

## Public katalog

`/urunler` kategori filtreleri üç seviyeli ağacı kullanır. Bir ürün birden
fazla kategoriye bağlıysa ilgili kategori dallarının her birinde görünebilir.

Müşteriye yalnız ilgili ürünün seçilmiş renkleri ve tanımlanmış geçerli
renk-seri kombinasyonları gösterilir.

## Diğer ilişkiler

Konsept ilişkileri `product_concepts`, medya metadata'sı `media_assets`
üzerinden çalışır. Yeni renk sistemi bu ilişkileri bozmaz.

## Gerçek içerik

Phase 10 kapsamında gerçek ürün, kategori, konsept, fotoğraf ve varyant
bilgileri CMS'e girildikçe temsili/fallback içerik kademeli kaldırılacaktır.
