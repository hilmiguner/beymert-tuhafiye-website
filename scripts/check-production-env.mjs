import process from "node:process";

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function fail(message) {
  process.stderr.write(`ERROR: ${message}\n`);
  process.exitCode = 1;
}

if (!rawUrl) {
  fail("NEXT_PUBLIC_SITE_URL is not set.");
} else {
  try {
    const url = new URL(rawUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      fail("NEXT_PUBLIC_SITE_URL must use http:// or https://.");
    }

    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    if (localHosts.has(url.hostname)) {
      fail("NEXT_PUBLIC_SITE_URL must not point to localhost for production.");
    }

    if (url.pathname !== "/" || url.search || url.hash) {
      fail("NEXT_PUBLIC_SITE_URL must contain only the site origin, without path/query/hash.");
    }

    if (!process.exitCode) {
      process.stdout.write(
        `Production environment OK: NEXT_PUBLIC_SITE_URL=${url.origin}\n`,
      );
    }
  } catch {
    fail("NEXT_PUBLIC_SITE_URL is not a valid URL.");
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
