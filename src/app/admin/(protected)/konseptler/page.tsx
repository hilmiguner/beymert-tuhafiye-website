import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  deleted: "Konsept silindi.",
};

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

export default async function AdminConceptsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const supabase = await createClient();
  const { data: concepts, error: queryError } = await supabase
    .from("concepts")
    .select("id, name, slug, short_description, status, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <section>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="bt-eyebrow text-primary">İçerik Yönetimi</p>
          <h1 className="bt-display mt-2 text-4xl font-semibold">Konseptler</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Özel gün konseptlerini, ilgili ürünleri, yayın durumunu ve görselleri yönetin.
          </p>
        </div>

        <Link
          href="/admin/konseptler/yeni"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control bg-primary px-5 font-extrabold text-white shadow-soft hover:bg-primary-hover"
        >
          + Yeni Konsept
        </Link>
      </div>

      {success && successMessages[success] ? (
        <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
          {successMessages[success]}
        </div>
      ) : null}

      {error || queryError ? (
        <div
          role="alert"
          className="mt-5 rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
        >
          Konsept verileri alınamadı. Lütfen tekrar deneyin.
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-card border border-border bg-white shadow-soft">
        {concepts && concepts.length > 0 ? (
          <div className="divide-y divide-border">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                href={"/admin/konseptler/" + concept.id}
                className="grid gap-3 p-5 transition hover:bg-surface-muted sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-extrabold">{concept.name}</h2>
                    <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-[0.7rem] font-extrabold text-primary">
                      {statusLabels[concept.status]}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">
                    /konseptler/{concept.slug}
                  </p>
                  {concept.short_description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                      {concept.short_description}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>Sıra {concept.sort_order}</span>
                  <span className="font-extrabold text-primary">Düzenle →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center sm:p-12">
            <h2 className="text-xl font-extrabold">Henüz konsept yok.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              İlk konsepti oluşturarak özel gün içeriklerini hazırlamaya başlayın.
            </p>
            <Link
              href="/admin/konseptler/yeni"
              className="mt-5 inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
            >
              İlk konsepti oluştur
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
