import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/container";

const colors = [
  { name: "Primary", className: "bg-primary", value: "#C43D5A" },
  { name: "Secondary", className: "bg-secondary", value: "#6446D8" },
  { name: "Accent", className: "bg-accent", value: "#F7C948" },
  { name: "Surface", className: "bg-surface", value: "#FFFFFF" },
];

export default function Home() {
  return (
    <main>
      <Section>
        <Container>
          <div className="max-w-4xl">
            <p className="bt-eyebrow text-primary">Beymert Tuhafiye</p>
            <h1 className="bt-display bt-balance mt-5 text-5xl leading-[0.94] font-semibold sm:text-6xl lg:text-8xl">
              Renkli, sıcak ve modern bir dijital vitrin.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Bu ekran Phase 1 tasarım sistemini doğrulamak için kullanılan
              geçici bir kontrol yüzeyidir. Gerçek ana sayfa ve Hero sonraki
              fazlarda geliştirilecek.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#components" size="lg">
                Tasarım sistemini gör
              </ButtonLink>
              <ButtonLink href="#palette" variant="outline" size="lg">
                Renk paleti
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface-muted/45">
        <Container>
          <div id="palette">
            <p className="bt-eyebrow text-muted">Renk Sistemi</p>
            <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
              Kontrollü enerji.
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {colors.map((color) => (
                <Card key={color.name} className="overflow-hidden p-0">
                  <div className={`h-28 ${color.className}`} />
                  <div className="flex items-center justify-between p-5">
                    <span className="font-extrabold">{color.name}</span>
                    <span className="font-mono text-xs text-muted">
                      {color.value}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div id="components" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <p className="bt-eyebrow text-secondary">Typography</p>
              <h2 className="bt-display mt-4 text-5xl leading-none font-semibold">
                Kutlamalar biraz daha özel.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">
                Fraunces başlıklara sıcak ve karakterli bir ifade verirken,
                Nunito Sans ürün bilgileri ve navigasyonda yüksek okunabilirlik
                sağlar.
              </p>
            </Card>

            <Card tone="accent">
              <p className="bt-eyebrow">Component Primitives</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <ButtonLink href="#palette">
                  Primary
                </ButtonLink>
                <ButtonLink
                  href="#components"
                  variant="secondary"
                >
                  Secondary
                </ButtonLink>
                <ButtonLink
                  href="#palette"
                  variant="outline"
                >
                  Outline
                </ButtonLink>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
