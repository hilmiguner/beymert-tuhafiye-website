import { HeroSection } from "@/components/sections/hero-section";
import { Container, Section } from "@/components/ui/container";

const highlights = [
  "Helyum & Folyo Balon",
  "Doğum Günü",
  "Baby Shower",
  "Cinsiyet Partisi",
  "Söz · Nişan · Düğün",
  "Kına & Bekarlığa Veda",
  "Kişiye Özel Hediyelik",
  "Tül · Kurdele · Tuhafiye",
];

export default function Home() {
  return (
    <main>
      <HeroSection />

      <Section className="border-y border-border bg-surface">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="bt-eyebrow text-secondary">Beymert’te neler var?</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Özel günün neyse, başlangıç noktası burada.
              </h2>
            </div>
            <p className="max-w-lg leading-7 text-muted">
              Parti, tasarım ve tuhafiye ürünlerini tek yerde keşfet. Gerçek
              kategori kartları sonraki geliştirme fazında bu alanın yerini
              alacak.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-pill border border-border bg-background px-4 py-2.5 text-sm font-extrabold shadow-soft"
              >
                {item}
              </span>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
