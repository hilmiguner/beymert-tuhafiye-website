import type { Metadata } from "next";

import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { StoreContactSection } from "@/components/sections/store-contact-section";
import { Container, Section } from "@/components/ui/container";
import { siteConfig, whatsappHref } from "@/config/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Beymert Parti Malzemeleri Tuhafiye Tasarım ile telefon, WhatsApp ve mağaza ziyareti için iletişime geçin.",
};

export default function ContactPage() {
  return (
    <main>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">İletişim</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Sorunu yaz, ara ya da Gemlik’te mağazaya uğra.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Güncel ürün, renk, konsept ve mağaza ziyareti hakkında en hızlı
            bilgiyi doğrudan Beymert’ten alabilirsin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="rounded-control bg-primary px-6 py-3 text-center font-extrabold text-white shadow-soft transition-[transform,background-color,box-shadow] hover:bg-primary-hover hover:shadow-lift active:scale-[0.98]"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phoneE164}`}
              className="rounded-control border border-border bg-surface px-6 py-3 text-center font-extrabold shadow-soft transition-colors hover:border-primary/35 hover:bg-surface-muted"
            >
              {siteConfig.phoneDisplay}
            </a>
          </div>
        </Container>
      </Section>

      <StoreContactSection />
      <FinalCtaSection />
    </main>
  );
}
