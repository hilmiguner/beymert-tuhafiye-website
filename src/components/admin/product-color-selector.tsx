"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { colorGroupLabels } from "@/lib/product-options";
import type { ProductColorGroupKey } from "@/types/product";

export type AdminColorOption = {
  id: string;
  name: string;
  hex: string | null;
  groupKey: ProductColorGroupKey;
};

export type AdminSeriesOption = {
  id: string;
  name: string;
  slug: string;
};

export function ProductColorSelector({
  colors,
  series,
  selectedColorIds = [],
  selectedSeriesIds = [],
}: {
  colors: readonly AdminColorOption[];
  series: readonly AdminSeriesOption[];
  selectedColorIds?: readonly string[];
  selectedSeriesIds?: readonly string[];
}) {
  const [query, setQuery] = useState("");
  const [colorIds, setColorIds] = useState(
    () => new Set(selectedColorIds),
  );
  const [seriesIds, setSeriesIds] = useState(
    () => new Set(selectedSeriesIds),
  );

  const groupedColors = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    const groups = new Map<ProductColorGroupKey, AdminColorOption[]>();

    for (const color of colors) {
      if (
        normalized &&
        !color.name.toLocaleLowerCase("tr-TR").includes(normalized)
      ) {
        continue;
      }

      const current = groups.get(color.groupKey) ?? [];
      current.push(color);
      groups.set(color.groupKey, current);
    }

    return groups;
  }, [colors, query]);

  function toggleColor(id: string) {
    setColorIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSeries(id: string) {
    setSeriesIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="md:col-span-2 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      {[...colorIds].map((id) => (
        <input key={id} type="hidden" name="colorIds" value={id} />
      ))}
      {[...seriesIds].map((id) => (
        <input key={id} type="hidden" name="seriesIds" value={id} />
      ))}

      <fieldset className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <legend className="text-sm font-extrabold">Renkler</legend>
            <p className="mt-1 text-xs leading-5 text-muted">
              Birden fazla renk seçebilirsiniz. Yeni ürünlerde hiçbir renk
              seçili başlamaz.
            </p>
          </div>
          <Link
            href="/admin/renkler"
            className="text-xs font-extrabold text-primary hover:text-primary-hover"
          >
            Renk kataloğunu yönet →
          </Link>
        </div>

        <label className="mt-3 block">
          <span className="sr-only">Renk ara</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Renk ara…"
            className="min-h-11 w-full rounded-control border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <div className="mt-3 max-h-[28rem] overflow-y-auto rounded-control border border-border bg-white p-3">
          {([...groupedColors.entries()] as Array<
            [ProductColorGroupKey, AdminColorOption[]]
          >).map(([groupKey, groupColors]) => (
            <section key={groupKey} className="mt-5 first:mt-0">
              <h3 className="sticky top-0 z-10 bg-white py-2 text-xs font-black tracking-[0.08em] text-muted uppercase">
                {colorGroupLabels[groupKey]}
              </h3>
              <div className="grid gap-1 sm:grid-cols-2">
                {groupColors.map((color) => {
                  const checked = colorIds.has(color.id);
                  return (
                    <label
                      key={color.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-control border px-3 py-2.5 transition ${
                        checked
                          ? "border-primary/35 bg-primary/5"
                          : "border-transparent hover:bg-surface-muted"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleColor(color.id)}
                        className="size-4 accent-[var(--color-primary)]"
                      />
                      <span
                        className="size-5 shrink-0 rounded-full border border-black/10 bg-surface-muted"
                        style={
                          color.hex
                            ? { backgroundColor: color.hex }
                            : undefined
                        }
                      />
                      <span className="min-w-0 text-sm font-bold">
                        {color.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}

          {groupedColors.size === 0 ? (
            <p className="p-4 text-center text-sm text-muted">
              Aramayla eşleşen renk bulunamadı.
            </p>
          ) : null}
        </div>

        <p className="mt-2 text-xs font-semibold text-muted">
          {colorIds.size} renk seçili
        </p>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-extrabold">Renk Serisi</legend>
        <p className="mt-1 text-xs leading-5 text-muted">
          Standart, Makaron, Retro, Neon, Metalik ve Krom birbirinden bağımsız
          seçilir. Geçerli renk-seri eşleşmeleri ürün kaydedildikten sonra
          tanımlanır.
        </p>

        <div className="mt-3 space-y-2 rounded-control border border-border bg-white p-3">
          {series.map((item) => {
            const checked = seriesIds.has(item.id);
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-control border px-3 py-3 transition ${
                  checked
                    ? "border-primary/35 bg-primary/5"
                    : "border-transparent hover:bg-surface-muted"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSeries(item.id)}
                  className="size-4 accent-[var(--color-primary)]"
                />
                <span className="text-sm font-extrabold">{item.name}</span>
              </label>
            );
          })}
        </div>

        <p className="mt-2 text-xs font-semibold text-muted">
          {seriesIds.size} seri seçili
        </p>
      </fieldset>
    </div>
  );
}
