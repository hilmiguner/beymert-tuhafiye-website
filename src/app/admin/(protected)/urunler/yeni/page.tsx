import { createProductAction } from "@/app/admin/(protected)/urunler/actions";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order")
    .order("name");

  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Ürünler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">Yeni ürün</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Önce ürünü kaydedin. Ardından açılacak düzenleme ekranından fotoğrafları ekleyebilirsiniz.
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <ProductForm
            action={createProductAction}
            categories={categories ?? []}
            error={error}
            submitLabel="Ürünü Oluştur"
          />
        </div>
      </div>
    </section>
  );
}
