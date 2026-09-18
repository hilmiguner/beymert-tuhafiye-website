const plannedSections = [
  "Ürün kategorileri",
  "Parti konseptleri",
  "Öne çıkan ürünler",
  "Galeri",
  "Mağaza ve iletişim",
];

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-[var(--border)] pb-5">
        <span className="text-sm font-semibold tracking-[0.18em] uppercase">
          Beymert Tuhafiye
        </span>
        <span className="text-xs text-[var(--muted)]">Proje iskeleti</span>
      </header>

      <section className="mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center py-16">
        <p className="mb-5 text-sm font-medium text-[var(--muted)]">
          Parti malzemeleri · Konseptler · Özel günler
        </p>
        <h1 className="max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-8xl">
          Kutlamaların daha renkli hali.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Mobil öncelikli katalog ve mağaza tanıtım deneyiminin geliştirme
          iskeleti hazır. Görsel kimlik ve gerçek içerikler sonraki adımlarda
          bu yapı üzerine uygulanacak.
        </p>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[var(--border)] py-10">
        <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-[var(--muted)] uppercase">
          Planlanan ana bölümler
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {plannedSections.map((section, index) => (
            <div
              key={section}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <span className="text-xs text-[var(--muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-8 text-sm font-medium">{section}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
