# beymerttuhafiye.com — SEO Domain Migration

Canonical production domain: `https://beymerttuhafiye.com`

## Marka standardı

- İşletme adı: Beymert Tuhafiye
- Logo adı: Beymert Tuhafiye
- Canonical host: beymerttuhafiye.com
- Secondary host: www.beymerttuhafiye.com → 308 → apex

## Sıralı geçiş

1. `beymerttuhafiye.com` satın alınır.
2. Domain Vercel projesine eklenir.
3. DNS ve HTTPS READY doğrulanır.
4. `www.beymerttuhafiye.com` aynı projeye eklenir.
5. www → apex kalıcı redirect doğrulanır.
6. Production `NEXT_PUBLIC_SITE_URL` değeri `https://beymerttuhafiye.com` yapılır.
7. Production redeploy alınır.
8. Aşağıdaki origin'lerin tamamı aynı canonical hostu üretmelidir:
   - canonical
   - sitemap
   - robots sitemap URL
   - Open Graph URL
   - Store/WebSite JSON-LD
9. Google Business Profile website alanı canonical domaine çevrilir.
10. Search Console domain property doğrulanır.
11. `https://beymerttuhafiye.com/sitemap.xml` gönderilir.
12. Ana hedef URL'ler URL Inspection ile kontrol edilir.

## SEO güvenlik kuralları

- Vercel preview URL'leri canonical yapılmaz.
- `www` ve apex iki ayrı indexlenebilir site olarak bırakılmaz.
- Domain aktif olmadan production canonical yeni domaine çevrilmez.
- Eski public hostlar mümkün olduğunda canonical/redirect ile tek host altında konsolide edilir.
- NAP verisi Google Business Profile ile birebir eşitlenmeden sokak/kapı structured data'ya zorla yazılmaz.
