import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  deleted: "Galeri öğesi silindi.",
};

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const supabase = await createClient();

  const { data: items, error: queryError } = await supabase
    .from("gallery_items")
    .select(
      "id, title, description, status, sort_order, media_assets(storage_path, alt_text), categories(name), concepts(name)",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <section>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="bt-eyebrow text-primary">İçerik Yönetimi</p>
          <h1 className="bt-display mt-2 text-4xl font-semibold">Galeri</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Mağaza, organizasyon ve konsept görsellerini; kategori ve konsept ilişkileriyle birlikte yönetin.
          </p>
        </div>

        <Link
          href="/admin/galeri/yeni"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control bg-primary px-5 font-extrabold text-white shadow-soft hover:bg-primary-hover"
        >
          + Yeni Galeri Öğesi
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
          Galeri verileri alınamadı. Lütfen tekrar deneyin.
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-card border border-border bg-white shadow-soft">
        {items && items.length > 0 ? (
          <div className="divide-y divide-border">
            {items.map((item) => {
              const storagePath = item.media_assets?.storage_path;
              const imageUrl = storagePath
                ? supabase.storage.from("cms-media").getPublicUrl(storagePath).data.publicUrl
                : null;

              return (
                <Link
                  key={item.id}
                  href={"/admin/galeri/" + item.id}
                  className="grid gap-4 p-5 transition hover:bg-surface-muted sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center sm:p-6"
                >
                  <div className="overflow-hidden rounded-control border border-border bg-surface-muted">
                    {imageUrl ? (
                      <div
                        role="img"
                        aria-label={item.media_assets?.alt_text ?? item.title ?? "Galeri görseli"}
                        className="aspect-[4/3] bg-cover bg-center"
                        style={{ backgroundImage: 'url("' + imageUrl + '")' }}
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center p-3 text-center text-xs text-muted">
                        Görsel yok
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-extrabold">
                        {item.title || "Başlıksız galeri öğesi"}
                      </h2>
                      <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-[0.7rem] font-extrabold text-primary">
                        {statusLabels[item.status]}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted">
                      {item.categories?.name ?? "Kategori yok"} · {item.concepts?.name ?? "Konsept yok"}
                    </p>

                    {item.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span>Sıra {item.sort_order}</span>
                    <span className="font-extrabold text-primary">Düzenle →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center sm:p-12">
            <h2 className="text-xl font-extrabold">Henüz galeri öğesi yok.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              İlk görseli ekleyerek gerçek mağaza ve organizasyon galerisini oluşturmaya başlayın.
            </p>
            <Link
              href="/admin/galeri/yeni"
              className="mt-5 inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
            >
              İlk galeri öğesini oluştur
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
