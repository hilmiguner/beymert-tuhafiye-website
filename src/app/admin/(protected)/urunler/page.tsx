import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  deleted: "Ürün silindi.",
};

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const supabase = await createClient();
  const { data: products, error: queryError } = await supabase
    .from("products")
    .select("id, name, slug, short_description, status, sort_order, featured, new_arrival, categories(name)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <section>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="bt-eyebrow text-primary">İçerik Yönetimi</p>
          <h1 className="bt-display mt-2 text-4xl font-semibold">Ürünler</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Ürün metinlerini, kategori ilişkisini, yayın durumunu ve görsellerini yönetin.
          </p>
        </div>

        <Link
          href="/admin/urunler/yeni"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control bg-primary px-5 font-extrabold text-white shadow-soft hover:bg-primary-hover"
        >
          + Yeni Ürün
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
          Ürün verileri alınamadı. Lütfen tekrar deneyin.
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-card border border-border bg-white shadow-soft">
        {products && products.length > 0 ? (
          <div className="divide-y divide-border">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/urunler/${product.id}`}
                className="grid gap-3 p-5 transition hover:bg-surface-muted sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-extrabold">{product.name}</h2>
                    <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-[0.7rem] font-extrabold text-primary">
                      {statusLabels[product.status]}
                    </span>
                    {product.featured ? (
                      <span className="rounded-pill bg-amber-50 px-2.5 py-1 text-[0.7rem] font-extrabold text-amber-800">
                        Öne çıkan
                      </span>
                    ) : null}
                    {product.new_arrival ? (
                      <span className="rounded-pill bg-emerald-50 px-2.5 py-1 text-[0.7rem] font-extrabold text-emerald-800">
                        Yeni
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {product.categories?.name ?? "Kategorisiz"} · /urunler/{product.slug}
                  </p>
                  {product.short_description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                      {product.short_description}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>Sıra {product.sort_order}</span>
                  <span className="font-extrabold text-primary">Düzenle →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center sm:p-12">
            <h2 className="text-xl font-extrabold">Henüz ürün yok.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              İlk ürünü oluşturarak katalog içeriğini hazırlamaya başlayın.
            </p>
            <Link
              href="/admin/urunler/yeni"
              className="mt-5 inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
            >
              İlk ürünü oluştur
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
