import { createCategoryAction } from "@/app/admin/(protected)/kategoriler/actions";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Kategoriler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          Yeni kategori
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Kategori önce taslak olarak hazırlanabilir ve hazır olduğunda yayına
          alınabilir.
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <CategoryForm
            action={createCategoryAction}
            error={error}
            submitLabel="Kategori Oluştur"
          />
        </div>
      </div>
    </section>
  );
}
