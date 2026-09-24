import Link from "next/link";

const modules = [
  {
    title: "Kategoriler",
    description: "Kategori adları, açıklamaları, sıralama ve yayın durumu.",
    status: "Aktif",
    href: "/admin/kategoriler",
  },
  {
    title: "Ürünler",
    description: "Ürün metinleri, özellikleri, kategori ilişkileri ve görseller.",
    status: "Aktif",
    href: "/admin/urunler",
  },
  {
    title: "Konseptler",
    description: "Özel gün konseptleri, ilgili ürünler, kapak ve galeri görselleri.",
    status: "Aktif",
    href: "/admin/konseptler",
  },
  {
    title: "Galeri",
    description: "Mağaza ve organizasyon fotoğraflarının yayın yönetimi.",
    status: "Aktif",
    href: "/admin/galeri",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Beymert CMS</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold sm:text-5xl">
          İçerik yönetimi tek panelde.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          CMS altyapısı hazır. Kategori, ürün, konsept ve galeri yönetimi aktif;
          medya yükleme ve yayın akışları aynı panel üzerinden yönetiliyor.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-extrabold">{module.title}</h2>
                <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs font-extrabold text-primary">
                  {module.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                {module.description}
              </p>
              {module.href ? (
                <span className="mt-5 inline-block text-sm font-extrabold text-primary">
                  Yönet →
                </span>
              ) : null}
            </>
          );

          return module.href ? (
            <Link
              key={module.title}
              href={module.href}
              className="rounded-card border border-border bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift"
            >
              {content}
            </Link>
          ) : (
            <article
              key={module.title}
              className="rounded-card border border-border bg-white p-6 shadow-soft"
            >
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
