import { ConceptArtwork } from "@/components/concepts/concept-artwork";
import { ContentImageView } from "@/components/media/content-image";
import type { Concept, ConceptGalleryScene } from "@/types/concept";

export function ConceptMedia({
  concept,
  scene,
  fill = false,
  priority = false,
}: {
  concept: Concept;
  scene?: ConceptGalleryScene;
  fill?: boolean;
  priority?: boolean;
}) {
  const image = scene?.image ?? concept.coverImage;

  if (!image) {
    return (
      <ConceptArtwork
        motif={concept.motif}
        primary={concept.colors.primary}
        secondary={concept.colors.secondary}
        background={concept.colors.background}
        foreground={concept.colors.foreground}
        variant={scene?.variant ?? "hero"}
      />
    );
  }

  return (
    <div
      className={
        fill
          ? "relative h-full min-h-0 w-full overflow-hidden bg-surface-muted"
          : "relative min-h-56 w-full overflow-hidden bg-surface-muted"
      }
    >
      <ContentImageView
        image={image}
        priority={priority}
        sizes={
          fill
            ? "(max-width: 1023px) 100vw, 60vw"
            : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        }
      />
    </div>
  );
}
