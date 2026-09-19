import type { CSSProperties } from "react";

import type { ConceptMotif } from "@/types/concept";

type ConceptArtworkProps = {
  motif: ConceptMotif;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  variant?: "hero" | "table" | "detail";
};

export function ConceptArtwork({
  motif,
  primary,
  secondary,
  background,
  foreground,
  variant = "hero",
}: ConceptArtworkProps) {
  const style = {
    "--concept-primary": primary,
    "--concept-secondary": secondary,
    "--concept-background": background,
    "--concept-foreground": foreground,
  } as CSSProperties;

  return (
    <div
      className="relative h-full min-h-56 overflow-hidden"
      style={style}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--concept-background),white_70%)]" />
      <div className="absolute -right-8 -top-8 size-40 rounded-full bg-[var(--concept-primary)]/18 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 size-44 rounded-full bg-[var(--concept-secondary)]/22 blur-3xl" />

      {(motif === "safari" || motif === "football") && (
        <>
          <span className="absolute left-[8%] top-[13%] h-32 w-20 rotate-[-24deg] rounded-[60%_40%_60%_40%] bg-[var(--concept-primary)]/72" />
          <span className="absolute right-[8%] top-[18%] h-28 w-18 rotate-[28deg] rounded-[50%_50%_60%_40%] bg-[var(--concept-secondary)]/70" />
        </>
      )}

      {(motif === "princess" || motif === "bride") && (
        <>
          <span className="absolute left-[11%] top-[13%] h-24 w-17 rounded-[50%] bg-[var(--concept-primary)]/72 shadow-soft" />
          <span className="absolute right-[13%] top-[17%] h-20 w-14 rounded-[50%] bg-[var(--concept-secondary)]/68 shadow-soft" />
          <span className="absolute left-1/2 top-[8%] h-10 w-16 -translate-x-1/2 [clip-path:polygon(0_100%,15%_25%,37%_70%,50%_0,64%_70%,86%_25%,100%_100%)] bg-[var(--concept-secondary)]/80" />
        </>
      )}

      {motif === "unicorn" && (
        <>
          <span className="absolute left-[12%] top-[18%] size-20 rounded-full bg-[#e8b7d5]/85" />
          <span className="absolute left-[38%] top-[11%] size-24 rounded-full bg-[#c8b1e8]/80" />
          <span className="absolute right-[9%] top-[23%] size-18 rounded-full bg-[#aed7eb]/75" />
          <span className="absolute left-1/2 top-[9%] h-24 w-5 -translate-x-1/2 rotate-[8deg] [clip-path:polygon(50%_0,100%_100%,0_100%)] bg-[var(--concept-secondary)]/85" />
        </>
      )}

      {motif === "football" && (
        <span className="absolute left-1/2 top-[24%] grid size-24 -translate-x-1/2 place-items-center rounded-full bg-white text-3xl font-black text-[var(--concept-foreground)] shadow-soft">
          ⚽
        </span>
      )}

      {(motif === "pink-gold" || motif === "blue-silver") && (
        <>
          <span className="absolute left-[10%] top-[17%] h-24 w-17 rounded-[50%] bg-[var(--concept-primary)]/85 shadow-soft" />
          <span className="absolute left-[42%] top-[9%] h-28 w-20 rounded-[50%] bg-white shadow-soft" />
          <span className="absolute right-[9%] top-[20%] h-22 w-16 rounded-[50%] bg-[var(--concept-secondary)]/75 shadow-soft" />
        </>
      )}

      {motif === "baby" && (
        <>
          <span className="absolute left-[19%] top-[20%] size-20 rounded-full bg-white shadow-soft" />
          <span className="absolute left-[42%] top-[12%] size-24 rounded-full bg-white shadow-soft" />
          <span className="absolute right-[17%] top-[24%] size-18 rounded-full bg-white shadow-soft" />
        </>
      )}

      <div
        className={
          variant === "table"
            ? "absolute inset-x-[12%] bottom-[13%] h-[34%] rounded-[1.5rem_1.5rem_0.8rem_0.8rem] bg-white/90 shadow-soft"
            : variant === "detail"
              ? "absolute bottom-[15%] left-1/2 grid size-28 -translate-x-1/2 place-items-center rounded-full border-[10px] border-white bg-[var(--concept-primary)]/65 shadow-soft"
              : "absolute inset-x-[14%] bottom-[12%] h-[28%] rounded-[50%_50%_1.2rem_1.2rem] bg-white/85 shadow-soft"
        }
      />

      {variant === "table" && (
        <>
          <span className="absolute bottom-[30%] left-[22%] h-10 w-8 rounded-control bg-[var(--concept-primary)]/70" />
          <span className="absolute bottom-[30%] left-1/2 h-12 w-9 -translate-x-1/2 rounded-control bg-[var(--concept-secondary)]/70" />
          <span className="absolute bottom-[30%] right-[22%] h-9 w-8 rounded-control bg-[var(--concept-primary)]/45" />
        </>
      )}

      {variant === "detail" && (
        <span className="absolute bottom-[23%] left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-white text-lg font-black text-[var(--concept-foreground)]">
          B
        </span>
      )}
    </div>
  );
}
