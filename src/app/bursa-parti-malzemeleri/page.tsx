import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/products/product-card";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getPublicProducts } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import {
  directionsHref,
  getStoreSettings,
  whatsappHref,
} from "@/lib/store-settings";

const partyCategorySlugs = new Set([
  "balonlar",
  "dogum-gunu",
  "baby-shower",
  "cinsiyet-partisi",
  "soz-nisan-dugun",
  "kina-bekarliga-veda",
  "kisiye-ozel-hediyelik",
]);

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Bursa Parti Malzemeleri | Gemlik",
    description:
      "Bursa’da parti malzemeleri arıyorsanız Gemlik’teki Beymert’te balon, doğum günü, baby shower, söz-nişan ve özel gün ürünlerini keşfedin.",
    path: "/bursa-parti-malzemeleri",
  });
}

export default async function BursaPartySuppliesPage() {
  const [settings, products] = await Promise.all([
    getStoreSettings(),
    getPublicProducts(),
  ]);
  const featuredProducts = products
    .filter((product) => partyCategorySlugs.has(product.categorySlug))
    .slice(0, 4);

  return (
    <main id="main-content" tabIndex={-1}>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", path: "/" },
          {
            name: "Bursa Parti Malzemeleri",
            path: "/bursa-parti-malzemeleri",
          },
        ]}
      />

      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Bursa · Gemlik</p>
          <h1 className="bt-display bt-balance mt-4 max-w-5xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Bursa parti malzemeleri için Gemlik’te renkli bir mağaza.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            {settings.shortName}, Bursa’nın Gemlik ilçesindeki fiziksel
            mağazasında doğum günü, baby shower, cinsiyet partisi, söz, nişan,
            düğün ve diğer özel günler için balon ve parti malzemelerini bir
            araya getirir. Bursa genelinden ürün araştırırken mağazadaki güncel
            seçenekleri web sitesinden inceleyebilir, stok ve renk bilgisini
            WhatsApp’tan doğrulayabilirsin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/urunler">Ürünleri İncele</ButtonLink>
            <ButtonLink
              href={whatsappHref(
                settings,
                "Merhaba, Bursa parti malzemeleri için ürün ve stok bilgisi almak istiyorum.",
              )}
              target="_blank"
              rel="noreferrer"
              variant="outline"
            >
              WhatsApp’tan Sor
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-secondary">Kutlamaya göre seç</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Tek bir ürün yerine bütün kutlamayı planla.
              </h2>
            </div>
            <div className="space-y-4 leading-7 text-muted">
              <p>
                Parti alışverişinde ihtiyaç listesi kutlamanın türüne göre
                değişir. Doğum gününde balon, masa süsleri ve temalı detaylar
                öne çıkarken; baby shower, söz veya nişan hazırlığında renk
                uyumu ve tamamlayıcı dekor ürünleri daha belirleyici olabilir.
              </p>
              <p>
                Beymert’in kategori ve konsept sayfaları farklı ürün gruplarını
                birlikte keşfetmek için hazırlanmıştır. Aradığın ürünün güncel
                stokta olup olmadığını mağazaya gelmeden önce doğrulayabilirsin.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["/kategoriler/balonlar", "Balonlar"],
              ["/kategoriler/dogum-gunu", "Doğum Günü"],
              ["/kategoriler/baby-shower", "Baby Shower"],
              ["/kategoriler/soz-nisan-dugun", "Söz · Nişan · Düğün"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-card border border-border bg-surface p-5 font-extrabold shadow-soft transition-colors hover:border-primary/30 hover:text-primary"
              >
                {label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface-muted/35">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-primary">Bursa’da yerel alışveriş</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Fiziksel mağazamız Gemlik’te.
              </h2>
            </div>
            <div className="space-y-4 leading-7 text-muted">
              <p>
                Beymert’in mağazası Bursa merkezde değil, Bursa’nın Gemlik
                ilçesindedir. Bu sayfa Bursa’da parti malzemesi arayan
                ziyaretçilerin mağazanın gerçek konumunu ve sunduğu ürün
                gruplarını doğru şekilde bulabilmesi için hazırlanmıştır.
              </p>
              <p>
                Gemlik’e özel daha ayrıntılı yerel içerik için{" "}
                <Link
                  href="/gemlik-parti-malzemeleri"
                  className="font-extrabold text-primary hover:text-primary-hover"
                >
                  Gemlik parti malzemeleri
                </Link>{" "}
                sayfasını inceleyebilirsin.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {featuredProducts.length > 0 ? (
        <Section>
          <Container>
            <p className="bt-eyebrow text-secondary">Güncel katalogdan</p>
            <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
              Parti ürünlerinden seçmeler.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="border-t border-border bg-surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="bt-eyebrow text-primary">Mağaza ve yol tarifi</p>
              <h2 className="bt-display mt-3 text-3xl font-semibold sm:text-4xl">
                {settings.shortName} · {settings.locationLabel}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted">
                {settings.address}. Bursa’dan veya çevre ilçelerden gelmeden
                önce aradığın ürün grubunu WhatsApp’tan sorabilirsin.
              </p>
            </div>
            <ButtonLink
              href={directionsHref(settings)}
              target="_blank"
              rel="noreferrer"
              variant="outline"
            >
              Yol Tarifi
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
