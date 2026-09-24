import Link from "next/link";

import { ConceptCard } from "@/components/concepts/concept-card";
import { Container, Section } from "@/components/ui/container";
import { getPublicConcepts } from "@/lib/public-concepts";

export async function ConceptsSection() {
  const concepts = await getPublicConcepts();

  return (
    <Section className="bg-background">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="bt-eyebrow text-primary">Partini seç</p>
            <h2 className="bt-display bt-balance mt-3 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Bir renk paletinden fazlası: hazır bir atmosfer.
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="leading-7 text-muted">
              Farklı ürünleri tek tek seçmek yerine bir tema üzerinden ilerle.
              Renkleri, dekor dilini ve ilgili ürün gruplarını birlikte keşfet.
            </p>
            <Link
              href="/konseptler"
              className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-primary-hover"
            >
              Tüm konseptleri gör
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="bt-hide-scrollbar -mx-[var(--bt-gutter)] mt-9 overflow-x-auto px-[var(--bt-gutter)] pb-3 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <div className="grid auto-cols-[minmax(17rem,84vw)] grid-flow-col gap-4 snap-x snap-mandatory sm:grid-flow-row sm:grid-cols-2 sm:auto-cols-auto lg:grid-cols-4">
            {concepts.slice(0, 8).map((concept) => (
              <ConceptCard key={concept.slug} concept={concept} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
