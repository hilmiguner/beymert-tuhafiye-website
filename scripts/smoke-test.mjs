import process from "node:process";

const baseUrl = (
  process.env.SMOKE_BASE_URL?.trim() || "http://localhost:3000"
).replace(/\/+$/, "");

const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS ?? 10000);
const expectedCanonicalOrigin =
  process.env.SMOKE_CANONICAL_ORIGIN?.trim().replace(/\/+$/, "") || null;
const requireAdminAuth =
  process.env.SMOKE_REQUIRE_ADMIN_AUTH?.trim().toLowerCase() === "true";
const expectedPaths = (process.env.SMOKE_EXPECT_PATHS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)
  .map((value) => (value.startsWith("/") ? value : `/${value}`));

function line(message = "") {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  process.stderr.write(`ERROR: ${message}\n`);
  process.exitCode = 1;
}

async function fetchPath(pathname, { redirect = "follow" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${baseUrl}${pathname}`, {
      redirect,
      signal: controller.signal,
      headers: {
        "user-agent": "Beymert-QA-Smoke-Test/2.0",
      },
    });
  } catch (error) {
    fail(
      `${pathname} -> ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function request(pathname, expectedStatus) {
  const response = await fetchPath(pathname);

  if (!response) {
    return null;
  }

  if (expectedStatus !== undefined) {
    if (response.status !== expectedStatus) {
      fail(`${pathname} -> ${response.status}, expected ${expectedStatus}`);
    } else {
      line(`OK  ${response.status} ${pathname}`);
    }
  } else if (!response.ok) {
    fail(`${pathname} -> ${response.status}`);
  } else {
    line(`OK  ${response.status} ${pathname}`);
  }

  return response;
}

function extractSitemapEntries(xml) {
  const entries = [];

  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    try {
      const url = new URL(match[1]);
      entries.push({
        path: `${url.pathname}${url.search}`,
        origin: url.origin,
      });
    } catch {
      fail(`Invalid sitemap URL: ${match[1]}`);
    }
  }

  return entries;
}

function extractInternalLinks(html) {
  const paths = new Set();

  for (const match of html.matchAll(/href=["']([^"'#]+)["']/g)) {
    const href = match[1];

    if (
      href.startsWith("/") &&
      !href.startsWith("/_next/") &&
      !href.startsWith("//")
    ) {
      paths.add(href);
    }
  }

  return paths;
}

function getAttribute(tag, name) {
  const match = tag.match(
    new RegExp(String.raw`\b${name}\s*=\s*["']([^"']*)["']`, "i"),
  );
  return match?.[1] ?? null;
}

function findTag(html, tagName, predicate) {
  const expression = new RegExp(String.raw`<${tagName}\b[^>]*>`, "gi");

  for (const match of html.matchAll(expression)) {
    if (predicate(match[0])) {
      return match[0];
    }
  }

  return null;
}

function hasNoindex(html) {
  const robotsTag = findTag(
    html,
    "meta",
    (tag) => getAttribute(tag, "name")?.toLowerCase() === "robots",
  );

  return (getAttribute(robotsTag ?? "", "content") ?? "")
    .toLowerCase()
    .includes("noindex");
}

function assertPublicMetadata(html, pathname) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) {
    fail(`${pathname}: missing or empty <title>`);
  }

  const descriptionTag = findTag(
    html,
    "meta",
    (tag) => getAttribute(tag, "name")?.toLowerCase() === "description",
  );
  if (!getAttribute(descriptionTag ?? "", "content")?.trim()) {
    fail(`${pathname}: missing meta description`);
  }

  const canonicalTag = findTag(html, "link", (tag) =>
    (getAttribute(tag, "rel") ?? "")
      .toLowerCase()
      .split(/\s+/)
      .includes("canonical"),
  );
  const canonicalHref = getAttribute(canonicalTag ?? "", "href");

  if (!canonicalHref) {
    fail(`${pathname}: missing canonical URL`);
  } else {
    try {
      const canonical = new URL(canonicalHref, baseUrl);
      const expectedPath = new URL(pathname, baseUrl).pathname;

      if (canonical.pathname !== expectedPath) {
        fail(
          `${pathname}: canonical path ${canonical.pathname} does not match ${expectedPath}`,
        );
      }

      if (
        expectedCanonicalOrigin &&
        canonical.origin !== expectedCanonicalOrigin
      ) {
        fail(
          `${pathname}: canonical origin ${canonical.origin} does not match ${expectedCanonicalOrigin}`,
        );
      }
    } catch {
      fail(`${pathname}: invalid canonical URL ${canonicalHref}`);
    }
  }

  const ogUrlTag = findTag(
    html,
    "meta",
    (tag) => getAttribute(tag, "property")?.toLowerCase() === "og:url",
  );
  if (!getAttribute(ogUrlTag ?? "", "content")) {
    fail(`${pathname}: missing Open Graph URL`);
  }

  if (hasNoindex(html)) {
    fail(`${pathname}: public sitemap route is marked noindex`);
  }
}

function assertRouteFamily(routePaths, prefix, label) {
  const count = [...routePaths].filter((path) => path.startsWith(prefix)).length;

  if (count === 0) {
    fail(`sitemap.xml does not contain a dynamic ${label} route (${prefix}*)`);
  } else {
    line(`OK  sitemap ${label} detail routes: ${count}`);
  }
}

line(`Beymert smoke test: ${baseUrl}`);

const sitemapResponse = await request("/sitemap.xml");
if (!sitemapResponse) {
  process.exit(1);
}

const sitemapXml = await sitemapResponse.text();
const sitemapEntries = extractSitemapEntries(sitemapXml);
const routePaths = new Set(sitemapEntries.map((entry) => entry.path));

if (routePaths.size === 0) {
  fail("sitemap.xml did not contain any routes");
}

line(`Sitemap routes: ${routePaths.size}`);

for (const entry of sitemapEntries) {
  if (entry.path.startsWith("/admin") || entry.path.startsWith("/preview")) {
    fail(`Sensitive route leaked into sitemap: ${entry.path}`);
  }

  if (expectedCanonicalOrigin && entry.origin !== expectedCanonicalOrigin) {
    fail(
      `Sitemap origin ${entry.origin} does not match ${expectedCanonicalOrigin} for ${entry.path}`,
    );
  }
}

assertRouteFamily(routePaths, "/urunler/", "product");
assertRouteFamily(routePaths, "/kategoriler/", "category");
assertRouteFamily(routePaths, "/konseptler/", "concept");

for (const expectedPath of expectedPaths) {
  if (!routePaths.has(expectedPath)) {
    fail(`Expected CMS route missing from sitemap: ${expectedPath}`);
  } else {
    line(`OK  expected CMS route ${expectedPath}`);
  }
}

const discoveredLinks = new Set();

for (const pathname of routePaths) {
  const response = await request(pathname);

  if (!response?.ok) {
    continue;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    continue;
  }

  const html = await response.text();
  assertPublicMetadata(html, pathname);

  for (const href of extractInternalLinks(html)) {
    discoveredLinks.add(href);
  }
}

line(`Internal links discovered: ${discoveredLinks.size}`);

for (const href of discoveredLinks) {
  await request(href);
}

const robotsResponse = await request("/robots.txt");
if (robotsResponse?.ok) {
  const robots = await robotsResponse.text();

  if (!/sitemap:/i.test(robots)) {
    fail("robots.txt does not declare a sitemap");
  }
  if (!/^disallow:\s*\/admin\b/im.test(robots)) {
    fail("robots.txt does not disallow /admin");
  }
  if (!/^disallow:\s*\/preview\b/im.test(robots)) {
    fail("robots.txt does not disallow /preview");
  }
}

const rootResponse = await request("/");
if (rootResponse?.ok) {
  const expectedHeaders = [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "SAMEORIGIN"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
  ];

  for (const [name, expected] of expectedHeaders) {
    const actual = rootResponse.headers.get(name);
    if (actual?.toLowerCase() !== expected.toLowerCase()) {
      fail(`Header ${name}: got ${actual ?? "<missing>"}, expected ${expected}`);
    } else {
      line(`OK  header ${name}`);
    }
  }

  const html = await rootResponse.text();
  if (!/<html\b[^>]*\blang=["']tr["']/i.test(html)) {
    fail("Root document does not declare lang=tr");
  }
  if (!/type=["']application\/ld\+json["']/i.test(html)) {
    fail("Root document does not contain JSON-LD structured data");
  }
}

const adminResponse = await fetchPath("/admin", { redirect: "manual" });
if (adminResponse) {
  if (![307, 308].includes(adminResponse.status)) {
    fail(`/admin -> ${adminResponse.status}, expected redirect`);
  } else {
    const location = adminResponse.headers.get("location");
    const redirectPath = location
      ? new URL(location, baseUrl).pathname
      : null;
    const allowedTargets = requireAdminAuth
      ? ["/admin/login"]
      : ["/admin/login", "/admin/setup"];

    if (!redirectPath || !allowedTargets.includes(redirectPath)) {
      fail(
        `/admin redirects to ${redirectPath ?? "<missing>"}, expected ${allowedTargets.join(" or ")}`,
      );
    } else {
      line(`OK  admin redirect -> ${redirectPath}`);

      const authPageResponse = await request(redirectPath);
      if (authPageResponse?.ok) {
        const authHtml = await authPageResponse.text();
        if (!hasNoindex(authHtml)) {
          fail(`${redirectPath}: admin auth page is not marked noindex`);
        } else {
          line(`OK  ${redirectPath} noindex`);
        }
      }
    }
  }
}

await request("/__qa-intentional-404__", 404);

if (process.exitCode) {
  line("");
  line("Smoke test FAILED.");
  process.exit(process.exitCode);
}

line("");
line("Smoke test PASSED.");
