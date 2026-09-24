import { notFound } from "next/navigation";

import { PreviewBanner } from "@/components/admin/preview-banner";
import { Container, Section } from "@/components/ui/container";
import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

export default async function GalleryPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCmsAdmin();

  const { id } = await params;
  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("gallery_items")
    .select(
      "*, media_assets(storage_path, alt_text), categories(name), concepts(name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !item || !item.media_assets) {
    notFound();
  }

  const imageUrl = supabase.storage
    .from("cms-media")
    .getPublicUrl(item.media_assets.storage_path).data.publicUrl;

  return (
    <>
      <PreviewBanner
        editHref={"/admin/galeri/" + item.id}
        label={"Galeri: " + (item.title || "Başlıksız öğe")}
        status={statusLabels[item.status]}
      />

      <main id="main-content" tabIndex={-1}>
        <Section className="bt-brand-glow border-b border-border">
          <Container>
            <p className="bt-eyebrow text-primary">Beymert galerisi</p>
            <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
              {item.title || "Galeri görseli"}
            </h1>
            {item.description ? (
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {item.description}
              </p>
            ) : null}
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-surface shadow-lift">
              <div
                role="img"
                aria-label={item.media_assets.alt_text}
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: 'url("' + imageUrl + '")' }}
              />
              <div className="border-t border-border p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {item.categories ? (
                    <span className="rounded-pill bg-surface-muted px-3 py-1.5 text-xs font-extrabold text-primary">
                      {item.categories.name}
                    </span>
                  ) : null}
                  {item.concepts ? (
                    <span className="rounded-pill bg-surface-muted px-3 py-1.5 text-xs font-extrabold text-secondary">
                      {item.concepts.name}
                    </span>
                  ) : null}
                  <span className="rounded-pill border border-border px-3 py-1.5 text-xs font-extrabold text-muted">
                    {statusLabels[item.status]}
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
