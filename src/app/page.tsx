import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/container";
import { whatsappHref } from "@/config/site";

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
      <Section className="bt-brand-glow overflow-hidden">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="bt-eyebrow text-primary">Gemlik · Bursa</p>
              <h1 className="bt-display bt-balance mt-5 max-w-4xl text-5xl leading-[0.94] font-semibold sm:text-6xl lg:text-8xl">
                Kutlamanın her rengi Beymert’te.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Balondan doğum günü konseptlerine, söz-nişan hazırlıklarından
                kişiye özel hediyeliklere kadar özel günlerin için aradığın
                detayları keşfet.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/urunler" size="lg">
                  Ürünleri Keşfet
                </ButtonLink>
                <ButtonLink
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="lg"
                >
                  WhatsApp’tan Sor
                </ButtonLink>
              </div>
            </div>

            <Card className="relative overflow-hidden border-primary/10 bg-surface p-0">
              <div className="grid min-h-[25rem] grid-cols-2 gap-px bg-border sm:min-h-[29rem]">
                <div className="flex flex-col justify-end bg-[#f9dce6] p-5 sm:p-7">
                  <span className="bt-display text-4xl font-semibold text-[#8e3155]">
                    Parti
                  </span>
                  <span className="mt-2 text-sm font-bold text-[#8e3155]/75">
                    Balon · Konsept · Dekor
                  </span>
                </div>
                <div className="flex flex-col justify-end bg-[#f4ddd2] p-5 sm:p-7">
                  <span className="bt-display text-4xl font-semibold text-[#704834]">
                    Tasarım
                  </span>
                  <span className="mt-2 text-sm font-bold text-[#704834]/75">
                    Kişiye özel dokunuşlar
                  </span>
                </div>
                <div className="col-span-2 flex items-end justify-between gap-4 bg-[#fff6f8] p-5 sm:p-7">
                  <div>
                    <span className="bt-display text-4xl font-semibold">
                      Tuhafiye
                    </span>
                    <p className="mt-2 max-w-sm text-sm font-bold text-muted">
                      Tül, kurdele ve yaratıcı hazırlıkların tamamlayıcıları.
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-black text-white shadow-soft sm:size-20"
                  >
                    B
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

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
              Gerçek ürün ve kategori görselleri sonraki fazlarda eklenecek.
              Site kabuğu şimdiden Beymert’in ürün çeşitliliğine göre kuruldu.
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
