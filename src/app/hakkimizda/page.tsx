import type { Metadata } from "next";

import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { TrustSection } from "@/components/sections/trust-section";
import { Container, Section } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Beymert Parti Malzemeleri Tuhafiye Tasarım’ın Gemlik’te sunduğu parti malzemeleri, özel gün konseptleri, hediyelik ve tuhafiye yaklaşımını tanıyın.",
};

const values = [
  {
    title: "Kutlamayı bütün görmek",
    description:
      "Balondan kurdeleye kadar her parçayı aynı tema ve renk dili içinde değerlendirmek.",
  },
  {
    title: "Seçimi kolaylaştırmak",
    description:
      "Çok sayıda seçenek içinde ziyaretçiye kategori ve konsept üzerinden anlaşılır başlangıç noktaları sunmak.",
  },
  {
    title: "Doğrudan ulaşılabilir olmak",
    description:
      "Soruyu online sipariş sürecine dönüştürmeden, telefon ve WhatsApp üzerinden gerçek iletişime bağlamak.",
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Hakkımızda</p>
          <h1 className="bt-display bt-balance mt-4 max-w-5xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Kutlamaların küçük detaylarını bir araya getiren Gemlik vitrini.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Beymert Parti Malzemeleri Tuhafiye Tasarım; parti malzemeleri,
            balonlar, özel gün hazırlıkları, kişiye özel hediyelikler ve seçili
            tuhafiye ürünlerini aynı çatı altında buluşturur.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="bt-eyebrow text-secondary">Yaklaşımımız</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Ürün listesinden daha fazlası.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">
                Bu web sitesi de aynı yaklaşımı izliyor: önce özel günü ve
                atmosferi düşün, ardından kategori ve ürünleri o fikrin
                etrafında keşfet. Amacımız ziyaretçiye hazır bir e-ticaret
                sepeti sunmak değil; doğru başlangıç noktasını bulmasına
                yardımcı olmak.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {values.map((value, index) => (
                <article
                  key={value.title}
                  className="rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6"
                >
                  <span className="bt-display text-3xl font-semibold text-primary/70">
                    0{index + 1}
                  </span>
                  <h3 className="bt-display mt-5 text-2xl font-semibold">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <TrustSection />
      <FinalCtaSection />
    </main>
  );
}
