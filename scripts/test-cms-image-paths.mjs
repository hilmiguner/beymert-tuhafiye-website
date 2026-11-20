import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync("src/lib/cms-image-paths.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { cmsImageLoader, cmsImageStoragePaths, isPreoptimizedCmsImageUrl } =
  await import("data:text/javascript;base64," + Buffer.from(output).toString("base64"));

const root =
  "https://vvkrtkgxplcdgxvzmrgv.supabase.co/storage/v1/object/public/cms-media/products/123/example.cmsopt.webp";

test("optimized master uses exactly three precomputed CDN paths", () => {
  assert.equal(isPreoptimizedCmsImageUrl(root), true);
  assert.equal(cmsImageLoader({ src: root, width: 384, quality: 75 }), root.replace(".cmsopt.webp", ".cmsopt-640.webp"));
  assert.equal(cmsImageLoader({ src: root, width: 828, quality: 75 }), root.replace(".cmsopt.webp", ".cmsopt-1200.webp"));
  assert.equal(cmsImageLoader({ src: root, width: 1920, quality: 75 }), root);
  for (const width of [320, 640, 828, 1200, 1920, 2048, 3840]) {
    assert.ok(!cmsImageLoader({ src: root, width, quality: 75 }).includes("/_next/image"));
  }
});

test("old images do not masquerade as optimized images", () => {
  const legacy = root.replace(".cmsopt.webp", ".png");
  assert.equal(isPreoptimizedCmsImageUrl(legacy), false);
  assert.equal(cmsImageLoader({ src: legacy, width: 640, quality: 75 }), legacy);
  assert.deepEqual(cmsImageStoragePaths("products/test/photo.png"), ["products/test/photo.png"]);
});

test("precomputed sizes have deterministic cleanup paths", () => {
  assert.deepEqual(cmsImageStoragePaths("products/test/photo.cmsopt.webp"), [
    "products/test/photo.cmsopt.webp",
    "products/test/photo.cmsopt-640.webp",
    "products/test/photo.cmsopt-1200.webp",
  ]);
});

test("only HTTPS public CMS image links activate the custom loader", () => {
  assert.equal(isPreoptimizedCmsImageUrl("https://example.com/photo.cmsopt.webp"), false);
  assert.equal(isPreoptimizedCmsImageUrl("http://example.com/storage/v1/object/public/cms-media/photo.cmsopt.webp"), false);
  assert.equal(isPreoptimizedCmsImageUrl("https://example.com/storage/v1/object/public/cms-media/photo.cmsopt.webp"), true);
  assert.equal(isPreoptimizedCmsImageUrl("/media/scene-01.cmsopt.webp"), false);
});
