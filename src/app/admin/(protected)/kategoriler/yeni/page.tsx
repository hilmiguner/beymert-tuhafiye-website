import { createCategoryAction } from "@/app/admin/(protected)/kategoriler/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { buildAdminCategoryOptions } from "@/lib/category-hierarchy";
import { createClient } from "@/lib/supabase/server";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, parent_id, sort_order")
    .order("sort_order")
    .order("name");

  const parentOptions = buildAdminCategoryOptions(categories ?? []);

  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Kategoriler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          Yeni kategori
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Ana kategori, alt kategori veya üçüncü seviye kategori oluşturabilir;
          alt kategorileri istediğiniz uygun üst kategoriye bağlayabilirsiniz.
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <CategoryForm
            action={createCategoryAction}
            parentOptions={parentOptions}
            error={error}
            submitLabel="Kategori Oluştur"
          />
        </div>
      </div>
    </section>
  );
}
