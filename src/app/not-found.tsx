import Link from "next/link";

import { Container, Section } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow min-h-[60svh] border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">404</p>
          <h1 className="bt-display bt-balance mt-4 max-w-3xl text-5xl leading-[0.95] font-semibold sm:text-6xl">
            Aradığın sayfa burada değil.
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-muted">
            Bağlantı değişmiş olabilir. Ürünlere, konseptlere veya ana sayfaya
            dönerek Beymert’i keşfetmeye devam edebilirsin.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-control bg-primary px-5 py-3 font-extrabold text-white shadow-soft transition-colors hover:bg-primary-hover"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/urunler"
              className="rounded-control border border-border bg-surface px-5 py-3 font-extrabold shadow-soft transition-colors hover:bg-surface-muted"
            >
              Ürünler
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
