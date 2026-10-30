import { createProductAction } from "@/app/admin/(protected)/urunler/actions";
import { ProductForm } from "@/components/admin/product-form";
import { buildAdminCategoryOptions } from "@/lib/category-hierarchy";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const [
    { data: categories },
    { data: colors },
    { data: series },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, parent_id, sort_order")
      .order("sort_order")
      .order("name"),
    supabase
      .from("colors")
      .select("id, name, hex, group_key, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .order("name"),
    supabase
      .from("color_series")
      .select("id, name, slug, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const categoryOptions = buildAdminCategoryOptions(categories ?? []);
  const colorOptions = (colors ?? []).map((color) => ({
    id: color.id,
    name: color.name,
    hex: color.hex,
    groupKey: color.group_key as
      | "basic"
      | "special"
      | "metallic_chrome"
      | "other",
  }));
  const seriesOptions = (series ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
  }));

  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Ürünler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">Yeni ürün</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Ürünü bir veya birden fazla kategoriye bağlayabilirsiniz. Önce ürünü
          kaydedin; ardından açılacak düzenleme ekranından fotoğrafları
          ekleyebilirsiniz.
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <ProductForm
            action={createProductAction}
            categories={categoryOptions}
            colorOptions={colorOptions}
            seriesOptions={seriesOptions}
            error={error}
            submitLabel="Ürünü Oluştur"
          />
        </div>
      </div>
    </section>
  );
}
