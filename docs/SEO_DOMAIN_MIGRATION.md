# beymerttuhafiye.com — SEO Domain Migration

Canonical production domain: `https://www.beymerttuhafiye.com`

## Marka standardı

- İşletme adı: Beymert Tuhafiye
- Logo adı: Beymert Tuhafiye
- Canonical host: www.beymerttuhafiye.com
- Secondary host: beymerttuhafiye.com → 308 → www

## Sıralı geçiş

1. `beymerttuhafiye.com` satın alınır.
2. Domain Vercel projesine eklenir.
3. DNS ve HTTPS READY doğrulanır.
4. `www.beymerttuhafiye.com` aynı projeye eklenir.
5. apex → www kalıcı 308 redirect doğrulanır.
6. Uygulamanın canonical origin'i `https://www.beymerttuhafiye.com` olarak kilitlenir.
7. Production redeploy alınır.
8. Aşağıdaki origin'lerin tamamı aynı canonical hostu üretmelidir:
   - canonical
   - sitemap
   - robots sitemap URL
   - Open Graph URL
   - Store/WebSite JSON-LD
9. Google Business Profile website alanı canonical domaine çevrilir.
10. Search Console domain property doğrulanır.
11. `https://www.beymerttuhafiye.com/sitemap.xml` gönderilir.
12. Ana hedef URL'ler URL Inspection ile kontrol edilir.

## SEO güvenlik kuralları

- Vercel preview URL'leri canonical yapılmaz.
- `www` ve apex iki ayrı indexlenebilir site olarak bırakılmaz.
- Domain aktif olmadan production canonical yeni domaine çevrilmez.
- Eski public hostlar mümkün olduğunda canonical/redirect ile tek host altında konsolide edilir.
- NAP verisi Google Business Profile ile birebir eşitlenmeden sokak/kapı structured data'ya zorla yazılmaz.
