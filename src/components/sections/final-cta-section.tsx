import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { whatsappHref } from "@/config/site";

export function FinalCtaSection() {
  return (
    <Section>
      <Container>
        <div className="bt-brand-glow overflow-hidden rounded-[2rem] border border-border px-6 py-10 text-center shadow-lift sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <p className="bt-eyebrow text-primary">Hazırsan başlayalım</p>
          <h2 className="bt-display bt-balance mx-auto mt-3 max-w-4xl text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
            Aklındaki kutlamayı bize anlat.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted">
            Ürün, renk veya konsept seçmekte kararsızsan WhatsApp üzerinden ne
            hazırladığını yaz. Beymert’teki güncel seçenekler hakkında bilgi
            alabilirsin.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={whatsappHref(
                "Merhaba, hazırladığım kutlama için Beymert’teki seçenekler hakkında bilgi almak istiyorum.",
              )}
              target="_blank"
              rel="noreferrer"
              size="lg"
            >
              WhatsApp’tan Sor
            </ButtonLink>
            <ButtonLink href="/iletisim" variant="outline" size="lg">
              İletişim Bilgileri
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
