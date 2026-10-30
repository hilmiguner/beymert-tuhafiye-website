import type {
  ProductColor,
  ProductColorGroupKey,
  ProductColorVariant,
} from "@/types/product";

export const colorGroupLabels: Record<ProductColorGroupKey, string> = {
  basic: "Temel Renkler",
  special: "Özel Renk Tonları",
  metallic_chrome: "Metalik ve Krom Renkler",
  other: "Diğer Renk Seçenekleri",
};

const compoundAliases: Record<
  string,
  { colorName: string; seriesName: string }
> = {
  "metalik kırmızı": { colorName: "Kırmızı", seriesName: "Metalik" },
  "metalik mavi": { colorName: "Mavi", seriesName: "Metalik" },
  "metalik pembe": { colorName: "Pembe", seriesName: "Metalik" },
  "metalik mor": { colorName: "Mor", seriesName: "Metalik" },
  "metalik yeşil": { colorName: "Yeşil", seriesName: "Metalik" },
  "krom gold": { colorName: "Gold", seriesName: "Krom" },
  "krom silver": { colorName: "Silver", seriesName: "Krom" },
  "krom rose gold": { colorName: "Rose Gold", seriesName: "Krom" },
  "pembe krom": { colorName: "Pembe", seriesName: "Krom" },
  "gümüş krom": { colorName: "Silver", seriesName: "Krom" },
  "altın krom": { colorName: "Gold", seriesName: "Krom" },
};

function key(value: string | undefined) {
  return (value ?? "").trim().toLocaleLowerCase("tr-TR");
}

export function canonicalVariantParts(
  colorName: string,
  seriesName?: string,
) {
  const alias = compoundAliases[key(colorName)];

  if (!alias) {
    return {
      colorName,
      seriesName: seriesName?.trim() || undefined,
    };
  }

  return {
    colorName: alias.colorName,
    seriesName: alias.seriesName,
  };
}

export function dedupeProductVariants(
  variants: readonly ProductColorVariant[],
): ProductColorVariant[] {
  const result = new Map<string, ProductColorVariant>();

  for (const variant of variants) {
    const canonical = canonicalVariantParts(
      variant.colorName,
      variant.seriesName,
    );
    const normalizedKey = `${key(canonical.colorName)}|${key(canonical.seriesName)}`;
    const next = {
      ...variant,
      colorName: canonical.colorName,
      seriesName: canonical.seriesName,
    };
    const current = result.get(normalizedKey);

    if (!current || (!current.image && next.image)) {
      result.set(normalizedKey, next);
    }
  }

  return [...result.values()];
}

export function colorByName(
  colors: readonly ProductColor[],
  name: string,
) {
  return colors.find((color) => key(color.name) === key(name));
}
