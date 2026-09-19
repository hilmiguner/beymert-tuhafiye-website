import Link from "next/link";
import type { CSSProperties } from "react";

import { CategoryMedia } from "@/components/categories/category-media";
import type { Category } from "@/types/category";

export function CategoryCard({ category }: { category: Category }) {
  const style = {
    "--category-accent": category.accent,
    "--category-soft": category.accentSoft,
    "--category-dark": category.accentDark,
  } as CSSProperties;

  return (
    <Link
      href={`/kategoriler/${category.slug}`}
      style={style}
      className="group block min-w-0 snap-start overflow-hidden rounded-card border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-[var(--bt-duration-normal)] ease-[var(--bt-ease-standard)] hover:-translate-y-1 hover:border-[var(--category-accent)]/35 hover:shadow-lift active:scale-[0.985]"
    >
      <div className="overflow-hidden border-b border-border">
        <div className="transition-transform duration-[var(--bt-duration-slow)] ease-[var(--bt-ease-emphasized)] group-hover:scale-[1.025]">
          <CategoryMedia category={category} />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p
          className="bt-eyebrow"
          style={{ color: category.accentDark }}
        >
          {category.eyebrow}
        </p>
        <h3 className="bt-display mt-2 text-[1.8rem] leading-tight font-semibold">
          {category.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          {category.shortDescription}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-foreground">
          Kategoriyi keşfet
          <span
            aria-hidden="true"
            className="transition-transform duration-[var(--bt-duration-normal)] group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
