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

export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCmsAdmin();

  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: product, error: productError },
    { data: mediaRelations },
    { data: conceptRelations },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("product_media")
      .select(
        "media_id, sort_order, is_cover, media_assets(storage_path, alt_text)",
      )
      .eq("product_id", id)
      .order("sort_order"),
    supabase
      .from("product_concepts")
      .select("concepts(id, name, slug, status)")
      .eq("product_id", id),
  ]);

  if (productError || !product) {
    notFound();
  }

  const media = (mediaRelations ?? [])
    .filter((relation) => relation.media_assets)
    .map((relation) => ({
      id: relation.media_id,
      storagePath: relation.media_assets!.storage_path,
      altText: relation.media_assets!.alt_text,
      isCover: relation.is_cover,
      sortOrder: relation.sort_order,
      url: supabase.storage
        .from("cms-media")
        .getPublicUrl(relation.media_assets!.storage_path).data.publicUrl,
    }));

  const cover = media.find((item) => item.isCover) ?? media[0] ?? null;
  const relatedConcepts = (conceptRelations ?? [])
    .map((relation) => relation.concepts)
    .filter((concept) => concept !== null);

  return (
    <>
      <PreviewBanner
        editHref={"/admin/urunler/" + product.id}
        label={"Ürün: " + product.name}
        status={statusLabels[product.status]}
      />

      <main id="main-content" tabIndex={-1}>
        <Section className="border-b border-border bg-surface-muted/30">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
                    Bu ürün için henüz kapak fotoğrafı yüklenmedi.
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {product.new_arrival ? (
                    <span className="rounded-pill bg-foreground px-3 py-1.5 text-xs font-black tracking-[0.08em] text-white uppercase">
                      Yeni
                    </span>
                  ) : null}
                  {product.featured ? (
                    <span className="rounded-pill bg-primary px-3 py-1.5 text-xs font-black tracking-[0.08em] text-white uppercase">
                      Öne çıkan
                    </span>
                  ) : null}
                </div>

                <p className="bt-eyebrow mt-5 text-primary">
                  {product.categories?.name ?? "Beymert"}
                </p>
                <h1 className="bt-display bt-balance mt-3 text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
                  {product.name}
                </h1>
                {product.short_description ? (
                  <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                    {product.short_description}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href={whatsappHref(
                      product.whatsapp_message ||
                        'Merhaba, web sitenizde gördüğüm "' +
                          product.name +
                          '" hakkında bilgi almak istiyorum.',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp’tan Bilgi Al
                  </ButtonLink>
                  {product.categories ? (
                    <span className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-surface px-5 py-2.5 text-sm font-extrabold text-foreground">
                      {product.categories.name} kategorisi
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="bt-eyebrow text-secondary">Ürün bilgileri</p>
                <h2 className="bt-display mt-3 text-4xl font-semibold">
                  Renk ve detaylar.
                </h2>

                {product.colors.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-sm font-extrabold">Renk seçenekleri</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          className="rounded-pill border border-border bg-surface px-3.5 py-2 text-sm font-bold"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.dimensions ? (
                  <div className="mt-6">
                    <p className="text-sm font-extrabold">Ölçü / uygulama</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {product.dimensions}
                    </p>
                  </div>
                ) : null}
              </div>

              <div>
                <p className="bt-eyebrow text-primary">Ürün açıklaması</p>
                <RichTextContent
                  value={product.description_rich}
                  fallback={product.description}
                  className="mt-3"
                />
              </div>
            </div>
          </Container>
        </Section>

        {media.length > 0 ? (
          <Section className="border-y border-border bg-surface">
            <Container>
              <p className="bt-eyebrow text-primary">Ürün galerisi</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Ürünün tüm fotoğrafları.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {media.map((item, index) => (
                  <div
                    key={item.id}
                    className={
                      "overflow-hidden rounded-card border border-border bg-surface shadow-soft " +
                      (index === 0 ? "sm:col-span-2 lg:col-span-2" : "")
                    }
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

        {relatedConcepts.length > 0 ? (
          <Section>
            <Container>
              <p className="bt-eyebrow text-secondary">Konsept eşleşmeleri</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Bu ürünün bağlı olduğu konseptler.
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {relatedConcepts.map((concept) => (
                  <span
                    key={concept.id}
                    className="rounded-pill border border-border bg-background px-4 py-2.5 text-sm font-extrabold shadow-soft"
                  >
                    {concept.name} · {statusLabels[concept.status]}
                  </span>
                ))}
              </div>
            </Container>
          </Section>
        ) : null}
      </main>
    </>
  );
}
