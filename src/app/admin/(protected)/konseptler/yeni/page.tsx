import { createConceptAction } from "@/app/admin/(protected)/konseptler/actions";
import { ConceptForm } from "@/components/admin/concept-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewConceptPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, status")
    .order("name");

  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Konseptler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">Yeni konsept</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Önce konsepti kaydedin. Ardından düzenleme ekranından fotoğrafları ekleyebilirsiniz.
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <ConceptForm
            action={createConceptAction}
            products={products ?? []}
            error={error}
            submitLabel="Konsepti Oluştur"
          />
        </div>
      </div>
    </section>
  );
}
