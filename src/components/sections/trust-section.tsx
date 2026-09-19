import Link from "next/link";

import { Container, Section } from "@/components/ui/container";

const reasons = [
  {
    number: "01",
    title: "Gemlik’te doğrudan iletişim",
    description:
      "Ürün veya konsept hakkında uzun formlar yerine telefon ve WhatsApp üzerinden hızlıca bilgi alabilirsin.",
  },
  {
    number: "02",
    title: "Kutlamaya bütün olarak bakış",
    description:
      "Balon, masa, hediyelik ve tuhafiye detaylarını birbirinden kopuk ürünler yerine aynı atmosferin parçaları olarak ele alıyoruz.",
  },
  {
    number: "03",
    title: "Farklı özel günlere tek noktadan başlangıç",
    description:
      "Doğum gününden baby shower’a, söz ve nişandan kişiye özel hediyeliklere kadar farklı ihtiyaçları aynı vitrinde keşfedebilirsin.",
  },
] as const;

export function TrustSection() {
  return (
    <Section className="border-y border-border bg-surface">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="bt-eyebrow text-secondary">Neden Beymert?</p>
            <h2 className="bt-display bt-balance mt-3 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Ürün değil, kutlamanın tamamını düşün.
            </h2>
            <p className="mt-5 leading-7 text-muted">
              Beymert’in dijital vitrini; ürünleri tek tek listelemekten çok
              hangi parçaların birlikte iyi çalışabileceğini göstermeyi
              amaçlıyor.
            </p>
            <Link
              href="/hakkimizda"
              className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-primary-hover"
            >
              Beymert’i tanı
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-4">
            {reasons.map((reason) => (
              <article
                key={reason.number}
                className="grid gap-4 rounded-card border border-border bg-background p-5 shadow-soft sm:grid-cols-[4rem_1fr] sm:p-6"
              >
                <span className="bt-display text-3xl font-semibold text-primary/75">
                  {reason.number}
                </span>
                <div>
                  <h3 className="bt-display text-2xl font-semibold sm:text-3xl">
                    {reason.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
                    {reason.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
