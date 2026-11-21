# Hero Experience

## 21 Kasım 2026 — ana sayfa revizyonu

Beymert ana sayfasının sol vitrini ve sağ hareketli balon sahnesi kullanıcının onayladığı içeriğe göre revize edildi. Ana başlık, açıklama, slogan ve kutucuk adları yalnızca Hero bölümündedir; ürün kataloğuna veya Supabase veritabanına bir değişiklik yapılmadı.

### Üst metin

**GEMLİK · BURSA · PARTİLERİNİZE RENK KATIYORUZ**

### Ana başlık

**Gemlik’te Parti Malzemeleri, Hediyelik Eşya ve Kutlama Konseptleri**

Başlık dört blokta gösterilir. H1 erişilebilir adı tam metni korur.

### Slogan

**Hayalinizdeki Kutlamaları Gerçeğe Dönüştüren Her Detay Beymert’te!**

### Açıklama

Balonlardan özel gün konseptlerine, kişiye özel hediyeliklerden tül ve kurdeleye kadar partileriniz için aradığınız her şey Beymert’te.

### Sol alt — dört ürün kutucuğu

1. **Doğum Günü & Parti Süsleri:** Küçük pasta, parti şapkası, parti gözlüğü ve hafif konfeti.
2. **Hediyelik Eşya & Hediye Kutuları:** Şık kurdeleli iki hediye kutusu.
3. **Bebek Karşılama & Süsleri:** Yalnız oturan ayıcık. Biberon, ayakkabı ve gökkuşağı çizilmez.
4. **LED Işık & Dekorasyon:** Sıcak beyaz perde LED ışıkları ve önünde birkaç küçük LED mum. Çiçek çizilmez.

Görseller bağımsız, inline SVG çizimleridir. Harici görsel URL'si, yeni CDN çağrısı veya Vercel Image Optimization kullanmaz.

### Sağ vitrin — hareketli balonların altında

1. **Helyum Balonlar**
2. **Butik Çiçekler**
3. **Tül, Kurdele & Aksesuar**

Mobilde aynı üç başlık kompakt bir vitrin panelinde, geniş ekranda üç hafif döndürülmüş kartta gösterilir. Eski “Balon & Konsept”, “Nişan & Tasarım” ve “Tül · Kurdele · Hediyelik” yazıları kaldırılmıştır. Bu metinlerin vitrin içinde olması mağaza envanterini otomatik güncellemez.

## Korunan teknik davranışlar

- Hero, Client Component olarak kalır.
- GSAP giriş sırası: üst metin → dört başlık bloğu → slogan/açıklama → CTA → SVG kategori kartları → vitrin → balonlar → üç sağ kart.
- Sadece üç balon düşük genlikli sürekli hareket eder.
- Parallax yalnızca hover ve fine pointer destekli, en az 1024px cihazlarda etkindir; pointer ayrılınca katmanlar başlangıç konumuna döner.
- \`prefers-reduced-motion: reduce\` durumunda GSAP giriş ve sürekli animasyonlar kurulmaz; içerik hareketsiz kalır.
- Yeni SVG görseller dekoratiftir (\`aria-hidden\`); metin etiketleri görünür ve okunabilir.
- Sağ bölüm \`role="group"\` olarak tanımlanır; vitrin başlıkları yardımcı teknolojilerce erişilebilir.
- WebGL, Canvas, video veya yeni bitmap indirmesi eklenmedi.

## Test ve yayın politikası — 1 Aralık 2026'ya kadar

Kullanıcının GitHub Free Actions dakika/CI kotası dolduğu için **1 Aralık 2026'dan önce GitHub Actions CI çalıştırılmayacak ve bu PR merge edilmeyecek**.

- Geliştirmeler feature branch ve draft PR üzerinden birikir.
- Commit başlıklarında \`[skip ci]\` kullanılır; \`push\` ve \`pull_request\` tetikli GitHub Actions atlanır. Bu durumda bekleyen Quality Gate sonucu, başarılı test anlamına gelmez.
- \`pnpm qa:hero\` testi kalite kapısına eklendi ancak 1 Aralık'a kadar çalıştırılmayacak.
- 1 Aralık'ta bekleyen değişiklikler tek entegrasyon PR'ında birleştirilerek **bir GitHub Quality Gate** çalıştırılacak; lint, typecheck, görsel testleri, hero testi, production build ve smoke kontrolü doğrulanacak.
- Başarılı test ve kullanıcı merge onayı sonrasında production yayın yapılacak. Main'e merge commit mesajı da \`[skip ci]\` ile ayrı ikinci CI koşusu önlenecek.
- PR hazırlamak production yayını anlamına gelmez; mevcut canlı ana sayfa eski haliyle çalışmaya devam eder.

## 21 Kasım — seçili metin görünümü düzeltmesi

Kullanıcının ekran görüntüsündeki bazı başlıkların arkasında görünen şeftali/turuncu dikdörtgenler kartın bozuk arka planı değil, global `::selection` renginin (`--bt-accent`) seçilmiş metinlere uygulanmasıydı. Kartların metinleri yalnızca dekoratif kategori etiketleri olduğundan, dört kartın sarmalayıcısına Tailwind `select-none` eklendi. Bu, metnin yanlışlıkla fareyle seçilmesini engeller; başlıklar gerçek DOM metni olarak erişilebilir kalır. `::selection` stilinin sitenin diğer bölümlerindeki normal davranışı değiştirilmedi.

`qa:hero` testi kartların `select-none` özelliğini koruduğunu denetler. GitHub Actions CI, 1 Aralık'a kadar bilinçli olarak çalıştırılmayacak; görsel tarayıcı kontrolü Preview üzerinde yapılacaktır.

## 21 Kasım — dört kartta arka plan/katman düzeltmesi

İkinci ekran görüntüsünde metin seçimi kaybolmuş olmasına rağmen dört kartın etrafında **dikdörtgen biçimli pembe bir gölge bloğu** ve ayıcık kartının dışında dekoratif bir parça görünüyordu. İlk `select-none` değişikliği bu asıl sorunu çözmemişti.

- Kartların ortak zemini, `bg-white/78` ve `backdrop-blur-sm` yerine **opak `bg-white`** olarak güncellendi.
- `shadow-soft` kaldırılarak kartların 50px genişliğindeki üst üste binen gölgeleri önlendi. `border-border/75` ile yuvarlatılmış sınırlar korunur.
- `isolate` ile her kartın kendi katman sınırı belirlenir.
- Kahverengi dekoratif parçanın kaynağı global `bt-confetti-field` olduğu için Hero genel konfeti katmanı kaldırıldı. Doğum günü kartının SVG'sindeki hafif konfeti korunur.
- Diğer sayfaların genel CSS renkleri ve global seçili metin stilleri değiştirilmedi; GSAP animasyonları, dört SVG ve etiketler aynen kaldı.
- `qa:hero` statik kontrolü bu regresyonu test eder. GitHub Actions çalıştırılmayacak; PR taslak kalır.
