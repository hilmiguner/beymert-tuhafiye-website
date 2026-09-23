const modules = [
  {
    title: "Ürünler",
    description: "Ürün metinleri, özellikleri, kategori ilişkileri ve görseller.",
    status: "CRUD sırada",
  },
  {
    title: "Konseptler",
    description: "Özel gün konseptleri, açıklamalar, kapak ve galeri görselleri.",
    status: "CRUD sırada",
  },
  {
    title: "Galeri",
    description: "Mağaza ve organizasyon fotoğraflarının yayın yönetimi.",
    status: "CRUD sırada",
  },
  {
    title: "Mağaza Bilgileri",
    description: "Adres, çalışma saatleri, telefon ve sosyal medya alanları.",
    status: "Sonraki faz",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">CMS Foundation</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold sm:text-5xl">
          İçerik yönetimi tek panelde.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Bu ilk aşamada güvenli giriş, yetkilendirme, veritabanı ve medya
          altyapısı kuruluyor. CRUD modülleri sonraki adımlarda bu kabuğa
          eklenecek.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article
            key={module.title}
            className="rounded-card border border-border bg-white p-6 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-extrabold">{module.title}</h2>
              <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs font-extrabold text-primary">
                {module.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              {module.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
