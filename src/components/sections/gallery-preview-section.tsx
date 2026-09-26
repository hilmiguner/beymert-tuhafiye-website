import Link from "next/link";

import { GalleryArtwork } from "@/components/gallery/gallery-artwork";
import { Container, Section } from "@/components/ui/container";
import { getPublicGalleryItems } from "@/lib/public-gallery";

export async function GalleryPreviewSection() {
  const galleryItems = await getPublicGalleryItems();
  const previewItems = galleryItems.slice(0, 4);

  if (previewItems.length === 0) {
    return null;
  }

  return (
    <Section className="bg-background">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="bt-eyebrow text-primary">Galeriden</p>
            <h2 className="bt-display bt-balance mt-3 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Fikri gör, sonra kendi kutlamana uyarlayalım.
            </h2>
          </div>
          <Link
            href="/galeri"
            className="w-fit text-sm font-extrabold text-primary hover:text-primary-hover"
          >
            Tüm galeriyi gör →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewItems.map((item) => (
            <Link
              key={item.id}
              href="/galeri"
              className="group overflow-hidden rounded-card border border-border bg-surface shadow-soft transition-[transform,box-shadow] duration-[var(--bt-duration-normal)] hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-[var(--bt-duration-slow)] ease-[var(--bt-ease-emphasized)] group-hover:scale-[1.02]">
                  <GalleryArtwork item={{ ...item, aspect: "square" }} />
                </div>
              </div>
              <div className="border-t border-border p-4">
                <h3 className="bt-display text-xl font-semibold">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
