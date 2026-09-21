import process from "node:process";

const baseUrl = (
  process.env.SMOKE_BASE_URL?.trim() || "http://localhost:3000"
).replace(/\/+$/, "");

const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS ?? 10000);

function line(message = "") {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  process.stderr.write(`ERROR: ${message}\n`);
  process.exitCode = 1;
}

async function request(pathname, expectedStatus) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${pathname}`, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Beymert-QA-Smoke-Test/1.0",
      },
    });

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
  } catch (error) {
    fail(
      `${pathname} -> ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractSitemapPaths(xml) {
  const paths = new Set();

  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    try {
      const url = new URL(match[1]);
      paths.add(`${url.pathname}${url.search}`);
    } catch {
      fail(`Invalid sitemap URL: ${match[1]}`);
    }
  }

  return paths;
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

line(`Beymert smoke test: ${baseUrl}`);

const sitemapResponse = await request("/sitemap.xml");
if (!sitemapResponse) {
  process.exit(1);
}

const sitemapXml = await sitemapResponse.text();
const routePaths = extractSitemapPaths(sitemapXml);

if (routePaths.size === 0) {
  fail("sitemap.xml did not contain any routes");
}

line(`Sitemap routes: ${routePaths.size}`);

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
}

await request("/__qa-intentional-404__", 404);

if (process.exitCode) {
  line("");
  line("Smoke test FAILED.");
  process.exit(process.exitCode);
}

line("");
line("Smoke test PASSED.");
