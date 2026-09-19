import {
  directionsHref,
  mapEmbedHref,
  siteConfig,
  whatsappHref,
} from "@/config/site";

import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";

export function StoreContactSection() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-surface shadow-lift lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="bt-eyebrow text-primary">Mağaza & iletişim</p>
            <h2 className="bt-display bt-balance mt-3 text-4xl leading-tight font-semibold sm:text-5xl">
              Gemlik’te bize ulaşmak kolay.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted">
              Ürün, konsept veya mağaza ziyareti hakkında bilgi almak için
              WhatsApp’tan yazabilir ya da doğrudan arayabilirsin.
            </p>

            <dl className="mt-8 grid gap-5">
              <div className="border-t border-border pt-4">
                <dt className="bt-eyebrow text-muted">Telefon</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${siteConfig.phoneE164}`}
                    className="bt-display text-2xl font-semibold transition-colors hover:text-primary"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </dd>
              </div>

              <div className="border-t border-border pt-4">
                <dt className="bt-eyebrow text-muted">Konum</dt>
                <dd className="mt-2 text-base font-extrabold">
                  {siteConfig.addressVerification.publicLabel}
                </dd>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Yol tarifi işletme adıyla güncel harita kaydını açar.
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <dt className="bt-eyebrow text-muted">Çalışma saatleri</dt>
                <dd className="mt-2 grid gap-1 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold">
                      {siteConfig.publicHours.weekdayLabel}
                    </span>
                    <span className="text-muted">
                      {siteConfig.publicHours.weekdayHours}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold">
                      {siteConfig.publicHours.sundayLabel}
                    </span>
                    <span className="text-right text-muted">
                      {siteConfig.publicHours.sundayHours}
                    </span>
                  </div>
                </dd>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Özel günlerde saatler değişebilir; gelmeden önce telefon veya
                  WhatsApp üzerinden doğrulamanı öneririz.
                </p>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp’tan Yaz
              </ButtonLink>
              <ButtonLink
                href={`tel:${siteConfig.phoneE164}`}
                variant="outline"
              >
                Telefonla Ara
              </ButtonLink>
              <ButtonLink
                href={directionsHref()}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
              >
                Yol Tarifi →
              </ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[22rem] border-t border-border bg-surface-muted lg:min-h-full lg:border-l lg:border-t-0">
            <iframe
              src={mapEmbedHref()}
              title="Beymert mağaza konumu"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
