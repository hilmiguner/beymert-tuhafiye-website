import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ProductCard } from "@/components/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getPublicProducts } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import {
  getStoreSettings,
  directionsHref,
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

const categoryLinks = [
  ["/kategoriler/balonlar", "Balonlar"],
  ["/kategoriler/dogum-gunu", "Doğum Günü"],
  ["/kategoriler/baby-shower", "Baby Shower"],
  ["/kategoriler/cinsiyet-partisi", "Cinsiyet Partisi"],
  ["/kategoriler/soz-nisan-dugun", "Söz · Nişan · Düğün"],
  ["/kategoriler/kina-bekarliga-veda", "Kına & Bekarlığa Veda"],
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Gemlik Parti Malzemeleri | Balon & Doğum Günü",
    description:
      "Gemlik’te parti malzemeleri, helyumlu ve folyo balon, doğum günü, baby shower, cinsiyet partisi, söz-nişan ve özel gün ürünlerini Beymert’te keşfedin.",
    path: "/gemlik-parti-malzemeleri",
  });
}

export default async function GemlikPartySuppliesPage() {
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
          { name: "Gemlik Parti Malzemeleri", path: "/gemlik-parti-malzemeleri" },
        ]}
      />

      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Gemlik · Bursa</p>
          <h1 className="bt-display bt-balance mt-4 max-w-5xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Gemlik parti malzemeleri: kutlamanın tüm detayları bir arada.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Gemlik’te doğum günü, baby shower, cinsiyet partisi, söz, nişan,
            düğün ve diğer özel günler için parti malzemeleri arıyorsan;
            balondan masa detaylarına, banner ve aksesuarlardan kişiye özel
            hediyeliklere kadar farklı ürün gruplarını {settings.shortName}’te
            inceleyebilirsin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/urunler">Ürünleri İncele</ButtonLink>
            <ButtonLink
              href={whatsappHref(
                settings,
                "Merhaba, Gemlik parti malzemeleri ve güncel ürünler hakkında bilgi almak istiyorum.",
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
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-secondary">Neler bulabilirsin?</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Özel güne göre hızlıca seçim yap.
              </h2>
              <p className="mt-5 leading-7 text-muted">
                Parti hazırlığında ihtiyaçlar etkinliğe göre değişir. Bu nedenle
                ürünleri yalnız tek tek listelemek yerine doğum günü, baby
                shower, cinsiyet partisi ve söz-nişan gibi kullanım alanlarına
                göre keşfedebilirsin.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {categoryLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-card border border-border bg-surface p-5 font-extrabold shadow-soft transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {label} <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface">
        <Container>
          <p className="bt-eyebrow text-primary">Gemlik’te parti alışverişi</p>
          <h2 className="bt-display mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
            Balon, dekor ve tamamlayıcı ürünleri aynı mağazada karşılaştır.
          </h2>
          <div className="mt-6 grid gap-6 text-sm leading-7 text-muted md:grid-cols-2 md:text-base">
            <p>
              Helyumlu lateks balon, folyo rakam balon, krom balon setleri,
              masa düzeni ürünleri, doğum günü yazıları ve temaya göre
              tamamlayıcı aksesuarlar arasından ihtiyacına uygun seçenekleri
              değerlendirebilirsin.
            </p>
            <p>
              Ürünlerin renk ve stok durumu dönemsel olarak değişebilir. Mağazaya
              gelmeden önce WhatsApp üzerinden aradığın ürün grubunu ve rengi
              sorarak güncel bilgiyi alabilirsin.
            </p>
          </div>
        </Container>
      </Section>

      {featuredProducts.length > 0 ? (
        <Section>
          <Container>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="bt-eyebrow text-secondary">Öne çıkanlar</p>
                <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                  Parti ürünlerinden seçmeler.
                </h2>
              </div>
              <Link
                href="/urunler"
                className="hidden text-sm font-extrabold text-primary sm:block"
              >
                Tüm ürünler →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="border-t border-border bg-surface-muted/35">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="bt-eyebrow text-primary">Mağaza bilgisi</p>
              <h2 className="bt-display mt-3 text-3xl font-semibold sm:text-4xl">
                {settings.shortName} · {settings.locationLabel}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted">
                {settings.address}. Güncel ürün ve stok bilgisi için iletişime
                geçebilir veya mağaza yol tarifini açabilirsin.
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
