import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ProductCard } from "@/components/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getPublicProductsByCategory } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import {
  directionsHref,
  getStoreSettings,
  whatsappHref,
} from "@/lib/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Gemlik Tuhafiye | Tül, Kurdele & Özel Gün Detayları",
    description:
      "Gemlik tuhafiye ürünleri için tül, saten kurdele, süsleme ve özel gün hazırlıklarında kullanılan tamamlayıcı ürünleri Beymert’te keşfedin.",
    path: "/gemlik-tuhafiye",
  });
}

export default async function GemlikNotionsPage() {
  const [settings, products] = await Promise.all([
    getStoreSettings(),
    getPublicProductsByCategory("tul-kurdele-tuhafiye"),
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Gemlik Tuhafiye", path: "/gemlik-tuhafiye" },
        ]}
      />

      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Gemlik · Bursa</p>
          <h1 className="bt-display bt-balance mt-4 max-w-5xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Gemlik tuhafiye: tül, kurdele ve özel gün detayları.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Gemlik’te tül, saten kurdele ve kutlama hazırlıklarında kullanılan
            tamamlayıcı tuhafiye ürünlerini arıyorsan, {settings.shortName}’te
            renk ve kullanım amacına göre seçenekleri inceleyebilirsin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/kategoriler/tul-kurdele-tuhafiye">
              Tuhafiye Kategorisini İncele
            </ButtonLink>
            <ButtonLink
              href={whatsappHref(
                settings,
                "Merhaba, Gemlik tuhafiye ürünleri; tül ve kurdele seçenekleri hakkında bilgi almak istiyorum.",
              )}
              target="_blank"
              rel="noreferrer"
              variant="outline"
            >
              Renk ve Stok Sor
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              [
                "Tül seçenekleri",
                "Süsleme, paketleme ve özel gün hazırlıklarında kullanılabilecek tül seçeneklerini renk ihtiyacına göre değerlendirebilirsin.",
              ],
              [
                "Saten kurdele",
                "Hediye sunumu, masa detayları ve dekoratif uygulamalar için farklı tonlardaki kurdele seçeneklerini sorabilirsin.",
              ],
              [
                "Özel gün tamamlayıcıları",
                "Parti ve organizasyon hazırlıklarında tuhafiye ürünlerini balon, hediyelik ve dekor ürünleriyle birlikte planlayabilirsin.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-card border border-border bg-surface p-6 shadow-soft"
              >
                <h2 className="bt-display text-3xl font-semibold">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="bt-eyebrow text-secondary">Gemlik’te tuhafiye</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Aradığın rengi mağazadan doğrula.
              </h2>
            </div>
            <div className="space-y-4 leading-7 text-muted">
              <p>
                Tül ve kurdele gibi ürünlerde renk tonu ekrandan ekrana
                değişebilir. Bu nedenle özellikle belirli bir konsept veya
                hazırlık için alışveriş yapıyorsan mağazada ürünü görerek seçim
                yapmak daha sağlıklı olabilir.
              </p>
              <p>
                Belirli bir renk arıyorsan gelmeden önce WhatsApp üzerinden
                sorabilirsin. Böylece güncel stok bilgisine göre mağaza
                ziyaretini planlayabilirsin.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {products.length > 0 ? (
        <Section>
          <Container>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="bt-eyebrow text-primary">Tuhafiye ürünleri</p>
                <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                  Yayındaki ürünlere göz at.
                </h2>
              </div>
              <Link
                href="/kategoriler/tul-kurdele-tuhafiye"
                className="hidden text-sm font-extrabold text-primary sm:block"
              >
                Kategoriye git →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
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
                {settings.address}. Mağazaya gelmeden önce aradığın renk veya
                ürün grubunu WhatsApp’tan sorabilirsin.
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
