import Link from "next/link";
import type { CSSProperties } from "react";

import { ConceptMedia } from "@/components/concepts/concept-media";
import type { Concept } from "@/types/concept";

export function ConceptCard({ concept }: { concept: Concept }) {
  const style = {
    "--concept-primary": concept.colors.primary,
    "--concept-secondary": concept.colors.secondary,
  } as CSSProperties;

  return (
    <Link
      href={`/konseptler/${concept.slug}`}
      style={style}
      className="group block min-w-0 snap-start overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-[var(--bt-duration-normal)] hover:-translate-y-1 hover:border-[var(--concept-primary)]/35 hover:shadow-lift active:scale-[0.985]"
    >
      <div className="overflow-hidden">
        <div className="transition-transform duration-[var(--bt-duration-slow)] ease-[var(--bt-ease-emphasized)] group-hover:scale-[1.025]">
          <ConceptMedia concept={concept} />
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <p
          className="bt-eyebrow"
          style={{ color: concept.colors.primary }}
        >
          {concept.eyebrow}
        </p>
        <h3 className="bt-display mt-2 text-[1.9rem] leading-tight font-semibold">
          {concept.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          {concept.shortDescription}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
          Konsepti keşfet
          <span
            aria-hidden="true"
            className="transition-transform duration-[var(--bt-duration-normal)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
