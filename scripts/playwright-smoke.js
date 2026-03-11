#!/usr/bin/env node

const { chromium, devices } = require("playwright");

function parseArgs(argv) {
  const parsed = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [key, value] = arg.slice(2).split("=");
    parsed[key] = value ?? "true";
  }
  return parsed;
}

function formatMs(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value}ms`;
}

function isIgnorableFailure(req, errorText) {
  return errorText.includes("ERR_ABORTED");
}

async function collectSeoPaths(context, baseUrl) {
  const page = await context.newPage();
  const paths = new Set();

  const listPages = ["/products", "/problems"];
  for (const listPath of listPages) {
    await page.goto(`${baseUrl}${listPath}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    const hrefPrefix = listPath === "/products" ? "/products/" : "/problems/";
    const links = await page
      .locator(`a[href^="${hrefPrefix}"]`)
      .evaluateAll((elements) => elements.map((el) => el.getAttribute("href") || ""));
    for (const href of links) {
      if (href) paths.add(href);
    }
  }

  await page.close();
  return Array.from(paths).sort();
}

async function runPageSmoke({ context, baseUrl, path, mode }) {
  const page = await context.newPage();

  if (mode === "mobile") {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200 * 1024,
      uploadThroughput: 90 * 1024,
      connectionType: "cellular4g",
    });
  }

  const issues = {
    consoleErrors: [],
    pageErrors: [],
    requestFailures: [],
    badResponses: [],
    actionErrors: [],
  };
  const actionNotes = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      issues.consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => issues.pageErrors.push(String(err)));
  page.on("requestfailed", (req) => {
    const errorText = req.failure()?.errorText || "unknown";
    if (isIgnorableFailure(req, errorText)) return;
    issues.requestFailures.push(`${req.method()} ${req.url()} :: ${errorText}`);
  });
  page.on("response", (res) => {
    if (res.status() < 400) return;
    const rt = res.request().resourceType();
    if (["document", "script", "stylesheet", "xhr", "fetch"].includes(rt)) {
      issues.badResponses.push(`${res.status()} ${rt} ${res.url()}`);
    }
  });

  let status = null;
  let gotoMs = null;
  let navMetrics = null;

  try {
    const t0 = Date.now();
    const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    gotoMs = Date.now() - t0;
    status = response ? response.status() : null;
    await page.waitForTimeout(500);

    navMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (!nav) return null;
      return {
        ttfbMs: Math.round(nav.responseStart),
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
        loadMs: Math.round(nav.loadEventEnd || 0),
      };
    });

    if (path === "/") {
      for (const sectionId of ["gallery", "solutions", "pricing", "faq"]) {
        try {
          const link = page.locator(`a[href="#${sectionId}"]:visible`).first();
          if ((await link.count()) === 0) {
            actionNotes.push(`${sectionId}:link-missing`);
            continue;
          }
          await link.click({ timeout: 8000 });
          await page.waitForTimeout(200);
          const sectionExists = (await page.locator(`#${sectionId}`).count()) > 0;
          actionNotes.push(`${sectionId}:${sectionExists ? "ok" : "missing-section"}`);
        } catch (err) {
          issues.actionErrors.push(`${sectionId}:${String(err)}`);
        }
      }
    }

    if (path === "/products" || path === "/problems") {
      const prefix = path === "/products" ? "/products/" : "/problems/";
      try {
        const first = page.locator(`a[href^="${prefix}"]`).first();
        if ((await first.count()) > 0) {
          await Promise.all([page.waitForURL(new RegExp(`${prefix}.+`), { timeout: 10000 }), first.click()]);
          const hasVisibleH1 = await page.locator("h1").first().isVisible().catch(() => false);
          actionNotes.push(`open-detail:${hasVisibleH1 ? "ok" : "no-h1"}`);
        } else {
          actionNotes.push("detail-link-missing");
        }
      } catch (err) {
        issues.actionErrors.push(`open-detail:${String(err)}`);
      }
    }

    if (path === "/admin/login") {
      const hasPassword = (await page.locator('input[type="password"]').count()) > 0;
      const hasSubmit = (await page.locator('button[type="submit"]').count()) > 0;
      actionNotes.push(`login-form:${hasPassword && hasSubmit ? "ok" : "incomplete"}`);
    }
  } catch (err) {
    issues.actionErrors.push(`goto:${String(err)}`);
  } finally {
    await page.close();
  }

  return {
    path,
    status,
    gotoMs,
    navMetrics,
    actionNotes,
    issueCounts: {
      consoleErrors: issues.consoleErrors.length,
      pageErrors: issues.pageErrors.length,
      requestFailures: issues.requestFailures.length,
      badResponses: issues.badResponses.length,
      actionErrors: issues.actionErrors.length,
    },
    issues,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.mode === "mobile" ? "mobile" : "desktop";
  const baseUrl = args.baseUrl || process.env.BASE_URL || "http://127.0.0.1:3000";

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(
    mode === "mobile" ? { ...devices["iPhone 13"] } : { viewport: { width: 1440, height: 900 } },
  );

  const seoPaths = await collectSeoPaths(context, baseUrl);
  const allPaths = Array.from(new Set(["/", "/products", "/problems", "/admin/login", ...seoPaths]));

  const results = [];
  for (const path of allPaths) {
    results.push(await runPageSmoke({ context, baseUrl, path, mode }));
  }

  await browser.close();

  const hardFailPages = results.filter((item) => {
    return (
      !item.status ||
      item.status >= 400 ||
      item.issueCounts.pageErrors > 0 ||
      item.issueCounts.requestFailures > 0 ||
      item.issueCounts.badResponses > 0 ||
      item.issueCounts.actionErrors > 0
    );
  });

  const slowest = [...results]
    .sort((a, b) => (b.gotoMs || 0) - (a.gotoMs || 0))
    .slice(0, 6)
    .map((item) => ({
      path: item.path,
      gotoMs: item.gotoMs,
      domContentLoadedMs: item.navMetrics?.domContentLoadedMs ?? null,
    }));

  console.log(`[smoke] mode=${mode} baseUrl=${baseUrl}`);
  console.log(`[smoke] pages=${results.length} hardFailPages=${hardFailPages.length}`);
  console.log("[smoke] slowest pages:");
  for (const row of slowest) {
    console.log(`  - ${row.path}: goto=${formatMs(row.gotoMs)}, domContentLoaded=${formatMs(row.domContentLoadedMs)}`);
  }

  if (hardFailPages.length > 0) {
    console.log("[smoke] failures:");
    for (const row of hardFailPages) {
      console.log(`  - ${row.path}`);
      console.log(`    status=${row.status}`);
      console.log(`    issueCounts=${JSON.stringify(row.issueCounts)}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[smoke] fatal error:", err);
  process.exit(1);
});
