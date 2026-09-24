import { notFound } from "next/navigation";

import {
  deleteConceptAction,
  updateConceptAction,
} from "@/app/admin/(protected)/konseptler/actions";
import { ConceptForm } from "@/components/admin/concept-form";
import {
  ConceptMediaManager,
  type ConceptMediaItem,
} from "@/components/admin/concept-media-manager";
import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  created: "Konsept oluşturuldu. Şimdi fotoğraflarını ekleyebilirsiniz.",
  updated: "Konsept güncellendi.",
};

export default async function EditConceptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const supabase = await createClient();

  const [
    { data: concept, error: conceptError },
    { data: products },
    { data: productRelations },
    { data: mediaRelations, error: mediaError },
  ] = await Promise.all([
    supabase.from("concepts").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("products")
      .select("id, name, status")
      .order("name"),
    supabase
      .from("product_concepts")
      .select("product_id")
      .eq("concept_id", id),
    supabase
      .from("concept_media")
      .select(
        "media_id, sort_order, is_cover, media_assets(id, storage_path, alt_text)",
      )
      .eq("concept_id", id)
      .order("sort_order"),
  ]);

  if (conceptError || !concept) {
    notFound();
  }

  const mediaItems: ConceptMediaItem[] = mediaError
    ? []
    : (mediaRelations ?? [])
        .filter((relation) => relation.media_assets)
        .map((relation) => ({
          mediaId: relation.media_id,
          storagePath: relation.media_assets!.storage_path,
          altText: relation.media_assets!.alt_text,
          sortOrder: relation.sort_order,
          isCover: relation.is_cover,
        }));

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Konseptler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">{concept.name}</h1>
        <p className="mt-2 font-mono text-xs text-muted">
          /konseptler/{concept.slug}
        </p>

        {success && successMessages[success] ? (
          <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            {successMessages[success]}
          </div>
        ) : null}

        <div className="mt-8 border-t border-border pt-8">
          <ConceptForm
            action={updateConceptAction}
            concept={concept}
            products={products ?? []}
            relatedProductIds={(productRelations ?? []).map(
              (relation) => relation.product_id,
            )}
            error={error}
            submitLabel="Değişiklikleri Kaydet"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <ConceptMediaManager
          conceptId={concept.id}
          conceptName={concept.name}
          initialItems={mediaItems}
        />
      </div>

      <div className="rounded-card border border-red-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-red-800">Tehlikeli alan</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Konsepti silmek geri alınamaz. İlgili ürün bağlantıları kaldırılır ve
          artık başka yerde kullanılmayan konsept fotoğrafları temizlenir.
        </p>
        <form action={deleteConceptAction} className="mt-4">
          <input type="hidden" name="id" value={concept.id} />
          <button
            type="submit"
            className="min-h-11 rounded-control border border-red-300 bg-red-50 px-5 font-extrabold text-red-800 transition hover:bg-red-100"
          >
            Konsepti Sil
          </button>
        </form>
      </div>
    </section>
  );
}
