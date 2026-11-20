import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync("src/lib/product-catalog-cards.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { toProductCardData } = await import(
  "data:text/javascript;base64," + Buffer.from(output).toString("base64")
);

test("catalogue serializes only card fields, not full product details", () => {
  const colors = Array.from({ length: 8 }, (_, index) => ({
    name: `Color ${index}`, hex: "#ffffff",
  }));
  const product = {
    slug: "card-one",
    name: "Card One",
    categorySlug: "balonlar",
    categoryName: "Balonlar",
    categorySlugs: ["balonlar", "dogum-gunu"],
    shortDescription: "Visible card summary",
    description: "PRIVATE_TO_DETAIL_LONG_DESCRIPTION",
    conceptSlugs: ["party"],
    artworkKind: "balloon-bouquet",
    images: [{ src: "cover.webp", alt: "Cover" }, { src: "extra.webp", alt: "Extra" }],
    colors,
    colorVariants: [{ colorId: "x", colorName: "Extra", colorHex: "#fff", images: [{ src: "variant.webp" }] }],
    colorSeries: [{ id: "s1", name: "Series", slug: "series" }],
    dimensions: "Large",
    whatsappMessage: "PRIVATE_TO_DETAIL_MESSAGE",
    highlights: ["Detail"],
    featured: true,
    newArrival: false,
    sortOrder: 1,
  };
  const [card] = toProductCardData([product]);
  assert.deepEqual(Object.keys(card).sort(), [
    "slug", "name", "categorySlug", "categoryName", "categorySlugs",
    "shortDescription", "artworkKind", "images", "colors",
    "featured", "newArrival",
  ].sort());
  assert.deepEqual(card.images, [product.images[0]]);
  assert.deepEqual(card.colors, colors.slice(0, 4));
  assert.deepEqual(card.categorySlugs, ["balonlar", "dogum-gunu"]);
  assert.equal(card.shortDescription, product.shortDescription);
  assert.equal(card.featured, true);
  assert.equal(card.newArrival, false);
  assert.ok(!JSON.stringify(card).includes("PRIVATE_TO_DETAIL"));
  assert.ok(!JSON.stringify(card).includes("variant.webp"));
  assert.deepEqual(toProductCardData([]), []);
});

test("fallback card without media retains artwork and category filtering", () => {
  const [card] = toProductCardData([{
    slug: "without-image", name: "No Image", categorySlug: "tuhafiye",
    shortDescription: "Basic card", artworkKind: "ribbon",
    colors: [], featured: false, newArrival: false,
  }]);
  assert.equal(card.images, undefined);
  assert.equal(card.artworkKind, "ribbon");
  assert.equal(card.categorySlug, "tuhafiye");
});
