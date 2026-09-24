import { ContentImageView } from "@/components/media/content-image";
import type { GalleryItem } from "@/types/gallery";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
} as const;

export function GalleryArtwork({
  item,
  fill = false,
}: {
  item: GalleryItem;
  fill?: boolean;
}) {
  const frameClass = fill
    ? "relative h-full w-full overflow-hidden bg-surface-muted"
    : `relative w-full overflow-hidden bg-surface-muted ${aspectClasses[item.aspect]}`;

  if (item.image) {
    return (
      <div className={frameClass}>
        <ContentImageView
          image={item.image}
          sizes={
            fill
              ? "100vw"
              : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`${frameClass} flex items-center justify-center p-6 text-center text-sm font-semibold text-muted`}
      role="img"
      aria-label={item.title}
    >
      Görsel hazırlanıyor.
    </div>
  );
}
