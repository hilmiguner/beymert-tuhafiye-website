import Link from "next/link";

import { Container, Section } from "@/components/ui/container";

const localPages = [
  {
    href: "/gemlik-parti-malzemeleri",
    eyebrow: "Gemlik parti malzemeleri",
    title: "Balon, doğum günü ve özel gün ürünleri",
    description:
      "Helyumlu ve folyo balonlardan doğum günü, baby shower, cinsiyet partisi, söz ve nişan hazırlıklarına kadar kutlama ürünlerini keşfet.",
  },
  {
    href: "/gemlik-tuhafiye",
    eyebrow: "Gemlik tuhafiye",
    title: "Tül, kurdele ve tamamlayıcı detaylar",
    description:
      "Tül, saten kurdele, süsleme ve özel gün hazırlıklarında kullanılan tamamlayıcı tuhafiye ürünlerine göz at.",
  },
] as const;

export function LocalSeoSection() {
  return (
    <Section className="border-y border-border bg-surface">
      <Container>
        <div className="max-w-3xl">
          <p className="bt-eyebrow text-primary">Gemlik’te mağazamız</p>
          <h2 className="bt-display bt-balance mt-3 text-4xl leading-tight font-semibold sm:text-5xl">
            Parti malzemeleri ve tuhafiye için yerel bir başlangıç noktası.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-muted">
            Aradığın ürün grubuna doğrudan ulaş; güncel renk ve stok bilgisini
            mağazadan doğrula.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {localPages.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-card border border-border bg-background p-6 shadow-soft transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift"
            >
              <p className="bt-eyebrow text-secondary">{item.eyebrow}</p>
              <h3 className="bt-display mt-3 text-3xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                Detayları gör <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
