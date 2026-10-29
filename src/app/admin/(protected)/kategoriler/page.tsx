import Link from "next/link";

import {
  buildAdminCategoryOptions,
  type CategoryLevel,
} from "@/lib/category-hierarchy";
import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  created: "Kategori oluşturuldu.",
  updated: "Kategori güncellendi.",
  deleted: "Kategori silindi.",
};

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

const levelLabels: Record<CategoryLevel, string> = {
  1: "Ana kategori",
  2: "Alt kategori",
  3: "3. seviye",
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const supabase = await createClient();
  const { data: categories, error: queryError } = await supabase
    .from("categories")
    .select(
      "id, parent_id, name, slug, description, status, sort_order, updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const rows = categories ?? [];
  const rowsById = new Map(rows.map((category) => [category.id, category]));
  const hierarchy = buildAdminCategoryOptions(rows);

  return (
    <section>
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="bt-eyebrow text-primary">İçerik Yönetimi</p>
          <h1 className="bt-display mt-2 text-4xl font-semibold">
            Kategoriler
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Kategorileri üç seviyeye kadar hiyerarşik olarak yönetin. Ana
            kategori, alt kategori ve üçüncü seviye kategori ilişkileri burada
            birlikte gösterilir.
          </p>
        </div>

        <Link
          href="/admin/kategoriler/yeni"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control bg-primary px-5 font-extrabold text-white shadow-soft hover:bg-primary-hover"
        >
          + Yeni Kategori
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
          Kategori verileri alınamadı. Lütfen tekrar deneyin.
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-card border border-border bg-white shadow-soft">
        {hierarchy.length > 0 ? (
          <div className="divide-y divide-border">
            {hierarchy.map((option) => {
              const category = rowsById.get(option.id);
              if (!category) return null;

              return (
                <Link
                  key={category.id}
                  href={`/admin/kategoriler/${category.id}`}
                  className="grid gap-3 p-5 transition hover:bg-surface-muted sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
                >
                  <div
                    className="min-w-0"
                    style={{ paddingLeft: `${(option.level - 1) * 1.5}rem` }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-extrabold">
                        {category.name}
                      </h2>
                      <span className="rounded-pill bg-primary/10 px-2.5 py-1 text-[0.7rem] font-extrabold text-primary">
                        {levelLabels[option.level]}
                      </span>
                      <span className="rounded-pill bg-surface-muted px-2.5 py-1 text-[0.7rem] font-extrabold text-primary">
                        {statusLabels[category.status]}
                      </span>
                    </div>
                    {option.level > 1 ? (
                      <p className="mt-1 text-xs font-semibold text-muted">
                        {option.path}
                      </p>
                    ) : null}
                    <p className="mt-1 font-mono text-xs text-muted">
                      /kategoriler/{category.slug}
                    </p>
                    {category.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                        {category.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span>Sıra {category.sort_order}</span>
                    <span className="font-extrabold text-primary">
                      Düzenle →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center sm:p-12">
            <h2 className="text-xl font-extrabold">Henüz kategori yok.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              İlk kategoriyi oluşturarak CMS içeriğini hazırlamaya başlayın.
            </p>
            <Link
              href="/admin/kategoriler/yeni"
              className="mt-5 inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
            >
              İlk kategoriyi oluştur
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
