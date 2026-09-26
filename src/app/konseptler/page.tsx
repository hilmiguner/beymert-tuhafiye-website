import type { Metadata } from "next";

import { ConceptCard } from "@/components/concepts/concept-card";
import { Container, Section } from "@/components/ui/container";
import { getPublicConcepts } from "@/lib/public-concepts";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Konseptler",
    description:
      "Safari, prenses, unicorn, futbol, Pink & Gold, Blue & Silver, baby shower ve Bride to Be gibi parti konseptlerini keşfedin.",
    path: "/konseptler",
  });
}

export default async function ConceptsPage() {
  const concepts = await getPublicConcepts();

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Partini seç</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Renkleri ve detayları tek bir tema altında buluştur.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Konseptler, farklı ürün kategorilerini bir araya getirerek
            kutlamanın genel atmosferini belirlemene yardımcı olur.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {concepts.map((concept) => (
              <ConceptCard key={concept.slug} concept={concept} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
