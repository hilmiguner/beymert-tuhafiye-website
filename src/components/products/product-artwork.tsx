import type { CSSProperties } from "react";

import type { Product, ProductArtworkKind } from "@/types/product";

type ProductArtworkProps = {
  product: Pick<Product, "artworkKind" | "colors" | "name">;
  variant?: "main" | "detail" | "color";
};

function ProductShape({ kind }: { kind: ProductArtworkKind }) {
  switch (kind) {
    case "balloon-bouquet":
    case "chrome-balloons":
    case "baby-balloons":
      return (
        <>
          <span className="absolute left-[16%] top-[18%] h-28 w-20 rounded-[50%] bg-[var(--product-primary)] shadow-soft" />
          <span className="absolute left-[43%] top-[10%] h-32 w-22 rounded-[50%] bg-[var(--product-secondary)] shadow-soft" />
          <span className="absolute right-[13%] top-[22%] h-25 w-18 rounded-[50%] bg-white shadow-soft" />
          <span className="absolute left-[26%] top-[57%] h-24 w-px bg-foreground/20" />
          <span className="absolute left-[54%] top-[55%] h-28 w-px bg-foreground/20" />
          <span className="absolute right-[22%] top-[58%] h-20 w-px bg-foreground/20" />
        </>
      );
    case "foil-number":
      return (
        <span className="bt-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%] text-[8rem] leading-none font-semibold text-[var(--product-primary)] drop-shadow-sm">
          8
        </span>
      );
    case "birthday-table":
    case "reveal-table":
      return (
        <>
          <span className="absolute inset-x-[14%] bottom-[17%] h-[34%] rounded-[1.4rem_1.4rem_0.7rem_0.7rem] bg-white shadow-soft" />
          <span className="absolute bottom-[36%] left-[22%] size-9 rounded-control bg-[var(--product-primary)]/75" />
          <span className="absolute bottom-[36%] left-1/2 size-11 -translate-x-1/2 rounded-control bg-[var(--product-secondary)]/75" />
          <span className="absolute bottom-[36%] right-[22%] size-8 rounded-control bg-[var(--product-primary)]/45" />
        </>
      );
    case "birthday-banner":
      return (
        <>
          <span className="absolute left-[12%] top-[28%] h-px w-[76%] rotate-[-3deg] bg-foreground/25" />
          {["H", "A", "P", "P", "Y"].map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="absolute top-[31%] grid size-10 place-items-center rounded-b-xl bg-[var(--product-primary)] text-sm font-black text-white shadow-soft"
              style={{ left: `${15 + index * 15}%`, rotate: `${index % 2 ? 3 : -3}deg` }}
            >
              {letter}
            </span>
          ))}
        </>
      );
    case "baby-keepsake":
    case "gift-basket":
      return (
        <>
          <span className="absolute left-1/2 top-[28%] h-28 w-36 -translate-x-1/2 rounded-[1.5rem_1.5rem_0.9rem_0.9rem] bg-white shadow-soft" />
          <span className="absolute left-1/2 top-[18%] h-20 w-28 -translate-x-1/2 rounded-[50%] border-[7px] border-[var(--product-secondary)]/65" />
          <span className="absolute left-1/2 top-[52%] h-5 w-36 -translate-x-1/2 bg-[var(--product-primary)]/55" />
        </>
      );
    case "reveal-balloon":
      return (
        <>
          <span className="absolute left-1/2 top-[16%] h-40 w-30 -translate-x-1/2 rounded-[50%] bg-[#333239] shadow-lift" />
          <span className="absolute left-1/2 top-[38%] -translate-x-1/2 text-5xl font-black text-white">?</span>
          <span className="absolute left-1/2 top-[62%] h-24 w-px -translate-x-1/2 bg-foreground/25" />
        </>
      );
    case "engagement-tray":
      return (
        <>
          <span className="absolute left-1/2 top-[28%] h-28 w-44 -translate-x-1/2 rounded-[50%] border-[8px] border-[var(--product-secondary)]/70 bg-white shadow-soft" />
          <span className="absolute left-[38%] top-[40%] size-12 rounded-full border-4 border-[var(--product-primary)]/75" />
          <span className="absolute right-[36%] top-[40%] size-12 rounded-full border-4 border-[var(--product-secondary)]/75" />
        </>
      );
    case "rose-gold-set":
    case "bride-set":
    case "henna-set":
      return (
        <>
          <span className="absolute left-[15%] top-[22%] h-24 w-17 rounded-[50%] bg-[var(--product-primary)]/82 shadow-soft" />
          <span className="absolute right-[14%] top-[18%] h-21 w-15 rounded-[50%] bg-[var(--product-secondary)]/78 shadow-soft" />
          <span className="absolute left-1/2 bottom-[18%] h-24 w-36 -translate-x-1/2 rounded-card bg-white shadow-soft" />
          <span className="absolute left-1/2 bottom-[33%] h-2 w-20 -translate-x-1/2 rounded-pill bg-[var(--product-primary)]/55" />
        </>
      );
    case "magnet":
      return (
        <>
          <span className="absolute left-1/2 top-[25%] grid size-36 -translate-x-1/2 place-items-center rounded-full border-[12px] border-white bg-[var(--product-primary)]/72 shadow-lift">
            <span className="bt-display text-4xl font-semibold text-white">B</span>
          </span>
        </>
      );
    case "ribbon":
      return (
        <>
          <span className="absolute left-[12%] top-[26%] h-16 w-40 rotate-[-14deg] rounded-pill bg-[var(--product-primary)]/82 shadow-soft" />
          <span className="absolute right-[10%] top-[38%] h-14 w-36 rotate-[17deg] rounded-pill bg-[var(--product-secondary)]/76 shadow-soft" />
          <span className="absolute bottom-[18%] left-1/2 size-24 -translate-x-1/2 rounded-full border-[12px] border-[var(--product-primary)]/55" />
        </>
      );
  }
}

export function ProductArtwork({
  product,
  variant = "main",
}: ProductArtworkProps) {
  const primary = product.colors[0]?.hex ?? "#d13f73";
  const secondary = product.colors[1]?.hex ?? "#e7b39a";
  const style = {
    "--product-primary": primary,
    "--product-secondary": secondary,
  } as CSSProperties;

  return (
    <div
      className="relative h-full min-h-60 overflow-hidden"
      style={style}
      aria-label={`${product.name} için temsili ürün görseli`}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,var(--product-primary),transparent_55%),linear-gradient(145deg,#fff_0%,#f9f1f3_100%)] opacity-20" />
      <div className="absolute -right-10 -top-12 size-44 rounded-full bg-[var(--product-secondary)]/25 blur-3xl" />
      <div className="absolute -bottom-14 -left-10 size-44 rounded-full bg-[var(--product-primary)]/18 blur-3xl" />

      <div
        className={
          variant === "detail"
            ? "absolute inset-[8%] scale-90"
            : variant === "color"
              ? "absolute inset-[10%] rotate-3 scale-95"
              : "absolute inset-[6%]"
        }
      >
        <ProductShape kind={product.artworkKind} />
      </div>

      <span className="absolute bottom-3 right-3 rounded-pill border border-white/80 bg-white/80 px-2.5 py-1 text-[0.62rem] font-extrabold tracking-[0.1em] text-muted uppercase backdrop-blur-sm">
        Temsili görsel
      </span>
    </div>
  );
}
