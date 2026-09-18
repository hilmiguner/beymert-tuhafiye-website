# Beymert Tuhafiye — Design System

Bu dosya Phase 1 ile oluşturulan görsel sistemin uygulama referansıdır.

## Tasarım karakteri

- Sıcak ve ulaşılabilir
- Parti kategorisine uygun şekilde enerjik
- Çocuk oyuncağı sitesi kadar renkli/karmaşık değil
- Ürün fotoğraflarının öne çıkmasına izin veren açık zemin
- Büyük, karakterli başlıklar
- Mobilde yüksek okunabilirlik ve büyük dokunma alanları

## Renk paleti

| Token | Değer | Kullanım |
| --- | --- | --- |
| Background | `#FFFAF5` | Ana sayfa zemini |
| Foreground | `#241A1F` | Ana metin |
| Surface | `#FFFFFF` | Kartlar |
| Surface muted | `#FFF1EA` | İkincil alanlar |
| Muted | `#74666E` | Yardımcı metin |
| Border | `#EADDE2` | İnce sınırlar |
| Primary | `#C43D5A` | Ana CTA / marka vurgusu |
| Secondary | `#6446D8` | İkincil vurgu |
| Accent | `#F7C948` | Highlight / sıcak vurgu |

Primary ve Secondary beyaz metin ile; Accent koyu metin ile kullanılmalıdır.

## Typography

### Display

- Fraunces Variable
- Büyük başlıklar, section başlıkları ve marka ifadeleri
- `.bt-display`

### Sans

- Nunito Sans Variable
- Body, navigation, butonlar ve ürün bilgileri
- Varsayılan body fontu

Fontlar Fontsource paketleriyle self-host edilir; runtime'da Google Fonts isteği yapılmaz.

## Radius

- Control: `0.875rem`
- Card: `1.5rem`
- Pill: `9999px`

## Layout

- Maksimum içerik genişliği: `80rem`
- Gutter: `clamp(1.25rem, 4vw, 3rem)`
- Section spacing: `clamp(4.5rem, 9vw, 8rem)`

`Container` ve `Section` primitive'leri kullanılmalıdır.

## Motion

- Fast: `140ms`
- Normal: `240ms`
- Slow: `480ms`
- Standard ease: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Emphasized ease: `cubic-bezier(0.16, 1, 0.3, 1)`

GSAP/Motion timeline'ları geliştirildiğinde mümkün olduğunca bu değerlerle aynı ritim korunur.

## UI primitive'leri

- `Button`
- `ButtonLink`
- `Card`
- `Container`
- `Section`

Yeni componentler mümkün olduğunca bu primitive'ler ve tokenlar üzerinden kurulmalıdır.

## Responsive yaklaşım

- Mobile-first
- Minimum interaktif hedef yüksekliği: 44px
- Mobilde hover'a bağımlı kritik etkileşim yok
- Büyük desktop boşlukları mobilde clamp/token sistemiyle otomatik küçülür

## Logo

Henüz final logo asset'i repository'ye eklenmedi. Logo geldiğinde mevcut renk/typography sistemiyle uyumu kontrol edilerek entegre edilecektir. Bu durum diğer UI geliştirmelerini bloke etmez.
