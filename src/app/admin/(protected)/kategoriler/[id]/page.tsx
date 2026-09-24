import { notFound } from "next/navigation";

import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/(protected)/kategoriler/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: category, error: queryError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (queryError || !category) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Kategoriler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          {category.name}
        </h1>
        <p className="mt-2 font-mono text-xs text-muted">
          /kategoriler/{category.slug}
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <CategoryForm
            action={updateCategoryAction}
            category={category}
            error={error}
            submitLabel="Değişiklikleri Kaydet"
          />
        </div>
      </div>

      <div className="rounded-card border border-red-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-red-800">Tehlikeli alan</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Kategoriyi silmek geri alınamaz. Bu kategoriye bağlı ürün ve galeri
          kayıtları silinmez; kategori bağlantıları kaldırılır.
        </p>
        <form action={deleteCategoryAction} className="mt-4">
          <input type="hidden" name="id" value={category.id} />
          <button
            type="submit"
            className="min-h-11 rounded-control border border-red-300 bg-red-50 px-5 font-extrabold text-red-800 transition hover:bg-red-100"
          >
            Kategoriyi Sil
          </button>
        </form>
      </div>
    </section>
  );
}
