import type { CSSProperties } from "react";

import type { CategoryMotif } from "@/types/category";

type ArtworkProps = {
  motif: CategoryMotif;
  accent: string;
  accentSoft: string;
  accentDark: string;
};

export function CategoryArtwork({
  motif,
  accent,
  accentSoft,
  accentDark,
}: ArtworkProps) {
  const style = {
    "--art-accent": accent,
    "--art-soft": accentSoft,
    "--art-dark": accentDark,
  } as CSSProperties;

  return (
    <div
      className="relative h-full min-h-44 overflow-hidden"
      style={style}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,var(--art-soft),transparent_44%),linear-gradient(145deg,#fff_0%,var(--art-soft)_100%)]" />
      <div className="absolute -right-9 -top-10 size-36 rounded-full bg-[var(--art-accent)]/12 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 size-36 rounded-full bg-[var(--art-accent)]/14 blur-2xl" />

      {motif === "balloons" && (
        <>
          <span className="absolute left-[16%] top-[23%] h-20 w-14 rounded-[50%_50%_48%_52%] bg-[var(--art-accent)] shadow-soft" />
          <span className="absolute left-[45%] top-[15%] h-24 w-16 rounded-[50%_50%_48%_52%] bg-white shadow-soft" />
          <span className="absolute right-[12%] top-[28%] h-18 w-13 rounded-[50%_50%_48%_52%] bg-[var(--art-dark)]/75 shadow-soft" />
          <span className="absolute left-[23%] top-[62%] h-20 w-px bg-[var(--art-dark)]/35" />
          <span className="absolute left-[54%] top-[61%] h-24 w-px bg-[var(--art-dark)]/30" />
          <span className="absolute right-[21%] top-[61%] h-16 w-px bg-[var(--art-dark)]/25" />
        </>
      )}

      {motif === "birthday" && (
        <>
          <div className="absolute bottom-[20%] left-1/2 h-20 w-32 -translate-x-1/2 rounded-[1.2rem_1.2rem_0.7rem_0.7rem] bg-white shadow-soft">
            <div className="absolute inset-x-0 top-4 h-2 bg-[var(--art-accent)]/75" />
            <div className="absolute left-1/2 top-[-2.4rem] h-10 w-2 -translate-x-1/2 rounded-pill bg-[var(--art-dark)]/70">
              <span className="absolute -left-1.5 -top-3 size-5 rounded-[50%_50%_50%_0] bg-[var(--art-accent)] rotate-45" />
            </div>
          </div>
          <span className="absolute left-[17%] top-[20%] size-9 rotate-12 rounded-control bg-[var(--art-accent)]/85" />
          <span className="absolute right-[16%] top-[23%] size-7 -rotate-12 rounded-full border-4 border-[var(--art-dark)]/55" />
        </>
      )}

      {motif === "baby" && (
        <>
          <span className="absolute left-[17%] top-[26%] size-20 rounded-full bg-white shadow-soft" />
          <span className="absolute left-[35%] top-[17%] size-24 rounded-full bg-white shadow-soft" />
          <span className="absolute left-[55%] top-[29%] size-17 rounded-full bg-white shadow-soft" />
          <span className="absolute bottom-[20%] left-1/2 h-11 w-32 -translate-x-1/2 rounded-pill bg-[var(--art-accent)]/70 shadow-soft" />
          <span className="absolute right-[17%] top-[16%] size-5 rotate-45 rounded-[45%_55%_45%_55%] bg-[var(--art-dark)]/55" />
        </>
      )}

      {motif === "reveal" && (
        <>
          <span className="absolute left-[15%] top-[22%] size-24 rounded-full bg-[#efb6c9] shadow-soft" />
          <span className="absolute right-[15%] top-[22%] size-24 rounded-full bg-[#b7cde8] shadow-soft" />
          <span className="absolute left-1/2 top-[39%] z-10 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-white text-xl font-black text-[var(--art-dark)] shadow-soft">
            ?
          </span>
          <span className="absolute bottom-[17%] left-1/2 h-2 w-32 -translate-x-1/2 rounded-pill bg-[var(--art-accent)]/55" />
        </>
      )}

      {motif === "wedding" && (
        <>
          <span className="absolute left-[25%] top-[24%] size-24 rounded-full border-[9px] border-[var(--art-accent)]/85" />
          <span className="absolute right-[25%] top-[24%] size-24 rounded-full border-[9px] border-[var(--art-dark)]/62" />
          <span className="absolute bottom-[18%] left-1/2 h-12 w-36 -translate-x-1/2 rounded-[50%] border-b-4 border-[var(--art-accent)]/65" />
        </>
      )}

      {motif === "celebration" && (
        <>
          <span className="absolute left-[17%] top-[24%] h-20 w-5 rotate-[24deg] rounded-pill bg-[var(--art-accent)]" />
          <span className="absolute left-[44%] top-[15%] h-16 w-4 -rotate-[18deg] rounded-pill bg-[var(--art-dark)]/65" />
          <span className="absolute right-[18%] top-[28%] h-19 w-5 rotate-[35deg] rounded-pill bg-white shadow-soft" />
          <span className="absolute bottom-[18%] left-[19%] size-12 rounded-full border-4 border-[var(--art-dark)]/45" />
          <span className="absolute bottom-[20%] right-[17%] size-9 rotate-45 rounded-control bg-[var(--art-accent)]/55" />
        </>
      )}

      {motif === "gift" && (
        <>
          <div className="absolute bottom-[18%] left-1/2 h-28 w-32 -translate-x-1/2 rounded-control bg-white shadow-soft">
            <span className="absolute left-1/2 top-0 h-full w-5 -translate-x-1/2 bg-[var(--art-accent)]/78" />
            <span className="absolute left-0 top-[38%] h-5 w-full bg-[var(--art-accent)]/78" />
          </div>
          <span className="absolute left-[35%] top-[18%] h-12 w-16 rotate-[-18deg] rounded-[55%_45%_55%_45%] border-4 border-[var(--art-dark)]/55" />
          <span className="absolute right-[35%] top-[18%] h-12 w-16 rotate-[18deg] rounded-[45%_55%_45%_55%] border-4 border-[var(--art-dark)]/55" />
        </>
      )}

      {motif === "ribbon" && (
        <>
          <span className="absolute left-[13%] top-[25%] h-16 w-36 rotate-[-15deg] rounded-pill bg-[var(--art-accent)]/75 shadow-soft" />
          <span className="absolute right-[10%] top-[34%] h-14 w-32 rotate-[18deg] rounded-pill bg-white shadow-soft" />
          <span className="absolute bottom-[18%] left-[28%] size-20 rounded-full border-[10px] border-[var(--art-dark)]/48" />
          <span className="absolute bottom-[19%] right-[22%] size-15 rounded-full border-[8px] border-[var(--art-accent)]/60" />
        </>
      )}
    </div>
  );
}
