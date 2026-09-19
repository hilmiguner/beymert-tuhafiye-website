# Hero Experience

Phase 3 hero uygulamasının teknik notları.

## Copy

Ana mesaj:

**Her kutlama biraz Beymert.**

Destek metni Beymert'in parti malzemeleri, özel gün konseptleri, kişiye özel hediyelikler ve tuhafiye tarafını birlikte anlatır.

## Görsel kompozisyon

Gerçek ürün fotoğrafları henüz içerik sistemine eklenmediği için Hero, bağımsız CSS/HTML öğelerinden oluşan bir vitrin sahnesi kullanır:

- 3 dekoratif balon
- Doğum günü / balon konsept kartı
- Nişan / tasarım kartı
- Tül / kurdele / hediyelik kartı
- Sınırlı konfeti detayları

Bu yapı placeholder değildir; gerçek ürün fotoğrafları geldiğinde sahne içine adapte edilebilecek bir kompozisyon iskeletidir.

## GSAP

Client boundary yalnızca `HeroSection` içindedir.

Timeline sırası:

1. Eyebrow
2. Başlık satırları
3. Açıklama
4. CTA'lar
5. Kategori chip'leri
6. Vitrin sahnesi
7. Balonlar
8. Ürün kartları

Sürekli hareket yalnızca üç balonda düşük genlikli `transform` animasyonu olarak çalışır.

## Pointer parallax

Sadece:

- hover destekleyen
- fine pointer kullanan
- minimum 1024px genişlikteki

cihazlarda etkinleştirilir.

Mobilde pointer parallax kurulmaz.

## Reduced motion

`prefers-reduced-motion: reduce` aktifse GSAP giriş/sürekli animasyonları kurulmaz ve içerik statik olarak görünür.

## Performance

- WebGL yok
- Canvas yok
- Video yok
- Hero asset download'u yok
- Animasyonlar transform/opacity odaklı
- Vitrin bölgesinde layout/paint containment kullanılır
- Mobilde konfeti sayısı azaltılır

Production build ve gerçek cihaz kontrolü Phase 3 merge öncesi kalite kapısıdır.
