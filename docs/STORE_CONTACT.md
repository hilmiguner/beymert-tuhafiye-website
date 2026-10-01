# About, Trust & Store Contact

Phase 9 mağaza ve iletişim katmanının güncel referansıdır.

## İçerik yaklaşımı

Hakkımızda içeriğinde doğrulanmamış:

- kuruluş yılı
- müşteri sayısı
- ekip büyüklüğü
- "en iyi" gibi karşılaştırmalı iddialar

kullanılmaz.

Metin Beymert'in kamuya açık ürün/hizmet kapsamı ve sitenin ürün-konsept keşif yaklaşımı üzerine kuruludur.

## Doğrulanmış iletişim

Telefon:

- 0543 337 70 04
- +90 543 337 70 04

Website:

- https://www.beymerttuhafiye.com

Facebook:

- facebook.com/beymertasarim

## Canonical adres

İşletme sahibi tarafından doğrulanan site adresi:

- Hamidiye Mahallesi, Kuşlu Sokak, Semöz Apartmanı No: 2/A, Gemlik/Bursa

Site, Supabase `store_settings`, footer, iletişim bölümü ve Store JSON-LD bu canonical adresi kullanır.

## Harici platform NAP durumu — 1 Ekim 2026

Google Business Profile:

- adres doğru fiziksel mağazayı gösteriyor
- telefon doğru
- website doğru
- işletme adı tabela değişikliği planı nedeniyle şimdilik mevcut haliyle korunuyor
- Google adres metnini kendi harita veri modeline göre normalize edebilir; doğruluk değerlendirmesinde fiziksel konum ve pin esas alınır

Yandex Business / Maps:

- eski ve hatalı `Irmak Sok. No:32/1C` kaydı "Move" kullanılmadan "Edit" ile düzeltildi
- public kartta `Hamidiye Mahallesi Kuşlu Sokak No: 2 Gemlik Bursa` gösteriliyor
- Yandex `2/A` değerini kabul etmediği için platformda `No: 2` normalizasyonu korunuyor
- pin aynı fiziksel mağazayı gösterdiği sürece site canonical `2/A` adresi değiştirilmez
- telefon ve website doğru
- işletme adı tabela değişikliği planı nedeniyle şimdilik mevcut haliyle korunuyor

Bu nedenle adres metinlerinin platformlar arasında karakter karakter aynı olması zorunlu kabul edilmez. Aynı fiziksel mağaza, doğru pin, telefon ve web sitesi tutarlılığı esas alınır.

## Çalışma saatleri

1 Ekim 2026 tarihinde işletme sahibi tarafından final doğrulandı; Google Business Profile'daki saatlerle aynıdır:

- Pazartesi: 10:00–19:30
- Salı: 10:00–19:30
- Çarşamba: 10:00–19:30
- Perşembe: 10:00–19:30
- Cuma: 10:00–19:30
- Cumartesi: 10:00–19:30
- Pazar: 13:00–19:09

Site/CMS özeti:

- Pazartesi–Cumartesi: 10:00–19:30
- Pazar: 13:00–19:09

Public görünüm ve Store JSON-LD bu owner-verified saatleri kullanır.

## Harita ve yol tarifi

Yol tarifi:

- doğrulanmış Google Place ID `ChIJCRiIsplbyhQRRlnbtUGuCXs` kullanır
- işletme adı sorgusu Place ID ile birlikte gönderilir

Map embed:

- `Beymert Parti Malzemeleri Tuhafiye Tasarım Gemlik Bursa` sorgusunu kullanır
- önceki yanlış marker davranışı nedeniyle iframe'de `place_id:` sorgusu kullanılmaz

Bu yapı Google'ın görünen adres metnini farklı normalize etmesinden bağımsız olarak doğru işletme kaydına yönlendirmeyi amaçlar.

## NAP regresyon kontrolü

Production smoke test public sitemap HTML sayfalarında:

- canonical adresi
- telefonun display ve E.164 biçimini
- Google Place ID'yi
- eski `Irmak Sok` ve `32/1C` kalıntılarının bulunmadığını

otomatik olarak denetler.

## Yeni sayfalar / bölümler

- /hakkimizda
- /iletisim
- ana sayfa Neden Beymert?
- ana sayfa mağaza/iletişim
- final CTA
- harita embed
- footer yol tarifi
