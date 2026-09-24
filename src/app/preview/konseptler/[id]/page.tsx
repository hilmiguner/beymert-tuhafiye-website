import { notFound } from "next/navigation";

import { PreviewBanner } from "@/components/admin/preview-banner";
import { RichTextContent } from "@/components/content/rich-text-content";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { whatsappHref } from "@/config/site";
import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

export default async function ConceptPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCmsAdmin();

  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: concept, error: conceptError },
    { data: mediaRelations },
    { data: productRelations },
  ] = await Promise.all([
    supabase.from("concepts").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("concept_media")
      .select(
        "media_id, sort_order, is_cover, media_assets(storage_path, alt_text)",
      )
      .eq("concept_id", id)
      .order("sort_order"),
    supabase
      .from("product_concepts")
      .select("products(id, name, slug, status, short_description)")
      .eq("concept_id", id),
  ]);

  if (conceptError || !concept) {
    notFound();
  }

  const media = (mediaRelations ?? [])
    .filter((relation) => relation.media_assets)
    .map((relation) => ({
      id: relation.media_id,
      storagePath: relation.media_assets!.storage_path,
      altText: relation.media_assets!.alt_text,
      isCover: relation.is_cover,
      url: supabase.storage
        .from("cms-media")
        .getPublicUrl(relation.media_assets!.storage_path).data.publicUrl,
    }));

  const cover = media.find((item) => item.isCover) ?? media[0] ?? null;
  const relatedProducts = (productRelations ?? [])
    .map((relation) => relation.products)
    .filter((product) => product !== null);

  return (
    <>
      <PreviewBanner
        editHref={"/admin/konseptler/" + concept.id}
        label={"Konsept: " + concept.name}
        status={statusLabels[concept.status]}
      />

      <main id="main-content" tabIndex={-1}>
        <Section className="border-b border-border bg-surface-muted/35">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="bt-eyebrow text-primary">Beymert Konsepti</p>
                <h1 className="bt-display bt-balance mt-4 text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
                  {concept.name}
                </h1>
                {concept.short_description ? (
                  <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                    {concept.short_description}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href={whatsappHref(
                      concept.whatsapp_message ||
                        'Merhaba, web sitenizdeki "' +
                          concept.name +
                          '" konsepti hakkında bilgi almak istiyorum.',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Konsepti WhatsApp’tan Sor
                  </ButtonLink>
                  <span className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-5 py-2.5 text-sm font-extrabold">
                    {statusLabels[concept.status]}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-surface shadow-lift">
                {cover ? (
                  <div
                    role="img"
                    aria-label={cover.altText}
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: 'url("' + cover.url + '")' }}
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-surface-muted p-8 text-center text-sm font-semibold text-muted">
                    Bu konsept için henüz kapak fotoğrafı yüklenmedi.
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="bt-eyebrow text-secondary">Konsept açıklaması</p>
                <h2 className="bt-display mt-3 text-4xl font-semibold">
                  Tema detayları.
                </h2>
              </div>
              <RichTextContent
                value={concept.description_rich}
                fallback={concept.description}
              />
            </div>
          </Container>
        </Section>

        {media.length > 0 ? (
          <Section className="border-y border-border bg-surface">
            <Container>
              <p className="bt-eyebrow text-primary">Konsept galerisi</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Aynı tema, farklı detaylar.
              </h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-card border border-border bg-surface shadow-soft"
                  >
                    <div
                      role="img"
                      aria-label={item.altText}
                      className="aspect-[4/3] bg-cover bg-center"
                      style={{ backgroundImage: 'url("' + item.url + '")' }}
                    />
                  </div>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}

        {relatedProducts.length > 0 ? (
          <Section>
            <Container>
              <p className="bt-eyebrow text-secondary">İlgili ürünler</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Bu konsepte bağlanan ürünler.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-card border border-border bg-surface p-5 shadow-soft"
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary">
                      {statusLabels[product.status]}
                    </p>
                    <h3 className="bt-display mt-2 text-2xl font-semibold">
                      {product.name}
                    </h3>
                    {product.short_description ? (
                      <p className="mt-3 text-sm leading-6 text-muted">
                        {product.short_description}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </main>
    </>
  );
}
