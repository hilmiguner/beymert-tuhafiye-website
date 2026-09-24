import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import {
  directionsHref,
  getStoreSettings,
  phoneHref,
  whatsappHref,
} from "@/lib/store-settings";

export async function HomepageStoreSection() {
  const settings = await getStoreSettings();

  return (
    <Section className="border-y border-border bg-surface">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="bt-eyebrow text-secondary">
              {settings.locationLabel} · {settings.shortName}
            </p>
            <h2 className="bt-display bt-balance mt-3 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Gör, sor, mağazada devam et.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted">
              Web sitesi ürünleri ve konseptleri keşfetmen için bir başlangıç
              noktası. Güncel seçenekler için WhatsApp’tan bilgi alabilir veya
              Gemlik’te mağazaya uğrayabilirsin.
            </p>
          </div>

          <div className="rounded-card border border-border bg-background p-5 shadow-soft sm:p-6">
            <p className="bt-eyebrow text-muted">İletişim</p>
            <a
              href={phoneHref(settings)}
              className="bt-display mt-3 block text-3xl font-semibold transition-colors hover:text-primary"
            >
              {settings.phoneDisplay}
            </a>
            <p className="mt-2 text-sm font-bold text-muted">
              {settings.address}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink
                href={whatsappHref(settings)}
                target="_blank"
                rel="noreferrer"
                size="sm"
              >
                WhatsApp
              </ButtonLink>
              <ButtonLink
                href={directionsHref(settings)}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="sm"
              >
                Yol Tarifi
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
