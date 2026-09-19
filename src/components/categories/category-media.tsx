import { CategoryArtwork } from "@/components/categories/category-artwork";
import { ContentImageView } from "@/components/media/content-image";
import type { Category } from "@/types/category";

export function CategoryMedia({
  category,
  priority = false,
}: {
  category: Category;
  priority?: boolean;
}) {
  if (!category.coverImage) {
    return (
      <CategoryArtwork
        motif={category.motif}
        accent={category.accent}
        accentSoft={category.accentSoft}
        accentDark={category.accentDark}
      />
    );
  }

  return (
    <div className="relative min-h-44 w-full overflow-hidden bg-surface-muted">
      <ContentImageView
        image={category.coverImage}
        priority={priority}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
      />
    </div>
  );
}
