import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const hero = readFileSync("src/components/sections/hero-section.tsx", "utf8");
const artwork = readFileSync("src/components/sections/hero-category-art.tsx", "utf8");
const page = readFileSync("src/app/page.tsx", "utf8");

test("approved Turkish hero text is present and old headings are gone", () => {
  const normalized = hero.replace(/\s+/g, " ");
  assert.ok(normalized.includes("GEMLİK · BURSA · PARTİLERİNİZE RENK KATIYORUZ"));
  assert.ok(normalized.includes('aria-label="Gemlik’te Parti Malzemeleri, Hediyelik Eşya ve Kutlama Konseptleri"'));
  assert.ok(normalized.includes("Hayalinizdeki Kutlamaları Gerçeğe Dönüştüren Her Detay Beymert’te!"));
  assert.ok(normalized.includes(
    "Balonlardan özel gün konseptlerine, kişiye özel hediyeliklerden tül ve kurdeleye kadar partileriniz için aradığınız her şey Beymert’te.",
  ));
  for (const outdated of ["Balon & Konsept", "Nişan & Tasarım", "Tül · Kurdele · Hediyelik", "Nişan & Düğün"]) {
    assert.ok(!hero.includes(outdated), "Old hero copy remains: " + outdated);
  }
});

test("four left illustration cards and three right labels match approved content", () => {
  for (const label of [
    "Doğum Günü & Parti Süsleri",
    "Hediyelik Eşya & Hediye Kutuları",
    "Bebek Karşılama & Süsleri",
    "LED Işık & Dekorasyon",
  ]) {
    assert.ok(hero.includes(label), "Missing category: " + label);
  }
  for (const heading of [
    "Helyum Balonlar",
    "Butik Çiçekler",
    "Tül, Kurdele & Aksesuar",
  ]) {
    assert.equal(hero.split(heading).length - 1, 2, "Both desktop/mobile must show: " + heading);
  }
  for (const kind of ['kind: "birthday"', 'kind: "gift"', 'kind: "baby"', 'kind: "led"']) {
    assert.ok(hero.includes(kind), "Category art missing: " + kind);
  }
  assert.ok(hero.includes("<HeroCategoryArt kind={category.kind} />"));
  assert.ok(hero.includes('role="group"'));
  assert.ok(!page.includes("locationLabel={settings.locationLabel}"));
  assert.ok(page.includes("<HeroSection"));
});

test("hero and its inline vector illustrations have valid TSX syntax", () => {
  for (const [file, content] of [
    ["hero-section.tsx", hero],
    ["hero-category-art.tsx", artwork],
  ]) {
    const parsed = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.deepEqual(
      parsed.parseDiagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
      [],
      "TSX parse error in " + file,
    );
  }
  for (const name of ["BirthdayArtwork", "GiftArtwork", "TeddyArtwork", "LedArtwork"]) {
    assert.ok(artwork.includes("function " + name + "()"));
  }
  assert.equal((artwork.match(/<svg\b/g) ?? []).length, 4);
  assert.ok(!artwork.includes("<image") && !artwork.includes("<img"), "Artwork must be local SVG only");
});

test("decorative category cards cannot accidentally select their labels", () => {
  const card = hero.match(/\{heroCategories\.map\(\(category\) => \(\s*<div[\s\S]*?<HeroCategoryArt kind=\{category\.kind\} \/>/)?.[0];
  assert.ok(card, "Four-card grid should render the decorative SVG component");
  assert.match(card, /\bselect-none\b/, "Card should suppress accidental text selection");
  assert.ok(
    hero.includes("{category.label}"),
    "Category labels must remain accessible as real text",
  );
});
