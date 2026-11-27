import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

const sections = [
  { id: "services", label: "Services" },
  { id: "approach", label: "Approach" },
  { id: "use-cases", label: "Use cases" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/** SITE-FR-16 fixed order */
const toolsInSpecOrder = [
  "Claude",
  "n8n",
  "Cursor",
  "Composio",
  "MCP Server",
  "Supabase",
  "Notion",
  "Google Workspace",
  "Microsoft",
  "Cloudflare",
  "AWS",
  "Azure",
] as const;

const useCaseTitles = [
  "Inquiry & FAQ assistant",
  "Lead qualification & follow-up",
  "Internal knowledge assistant",
  "Booking & follow-up workflows",
] as const;

const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function expectNoSeriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious).toEqual([]);
}

test.describe("marketing site", () => {
  test("primary nav reaches anchored sections", async ({ page }) => {
    await page.goto("/");

    for (const { id, label } of sections) {
      await page
        .getByRole("link", { name: label, exact: true })
        .first()
        .click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test("theme toggle persists in localStorage", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", {
      name: /switch color theme|switch to/i,
    });
    const before = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme"),
    );
    await toggle.click();
    const after = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme"),
    );
    expect(after).not.toBe(before);
    const stored = await page.evaluate(() => localStorage.getItem("dd-theme"));
    expect(stored).toBe(after);
  });

  test("Cloudflare Web Analytics beacon when token is configured", async ({
    page,
  }) => {
    const beaconScript = page.locator(
      'script[src*="static.cloudflareinsights.com/beacon.min.js"]',
    );
    await page.goto("/");
    await expect(beaconScript).toHaveCount(1);
    await expect(beaconScript).toHaveAttribute(
      "data-cf-beacon",
      /e2e-test-beacon-token/,
    );
    await page.goto("/privacy");
    await expect(beaconScript).toHaveCount(1);
  });

  test("home and privacy have title and meta description", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AI consulting and integration/);
    const homeDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(homeDesc).toMatch(/working solutions/i);

    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Privacy notice/);
    await expect(page.getByText(/Cloudflare Web Analytics/i)).toBeVisible();
    const privacyDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(privacyDesc).toMatch(/inquiry/i);
  });

  test("unknown path shows 404 with navigation", async ({ page }) => {
    await page.goto("/does-not-exist");
    await expect(
      page.getByRole("heading", { name: /not available/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /go to home/i })).toBeVisible();
  });

  test("contact form is enabled for live inquiry", async ({ page }) => {
    await page.goto("/#contact");
    await expect(
      page.getByRole("button", { name: "Send inquiry" }),
    ).toBeEnabled();
  });

  test("axe: no serious violations on index", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expectNoSeriousAxeViolations(page);
  });

  test("axe: no serious violations on privacy", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/privacy");
    await expectNoSeriousAxeViolations(page);
  });

  test("axe: no serious violations on 404", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/does-not-exist");
    await expectNoSeriousAxeViolations(page);
  });

  test("axe: no serious violations on contact", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#contact");
    await expectNoSeriousAxeViolations(page);
  });

  test("tools ticker sits in its own section between Services and Approach", async ({
    page,
  }) => {
    await page.goto("/");

    const sectionOrder = await page.evaluate(() => {
      const services = document.querySelector("#services");
      const toolsSection = document.querySelector("#tools");
      const ticker = document.querySelector(".tools-ticker");
      const approach = document.querySelector("#approach");
      if (!services || !toolsSection || !ticker || !approach) return null;
      const tickerInsideTools = toolsSection.contains(ticker);
      const tickerInsideServices = services.contains(ticker);
      const order =
        services.compareDocumentPosition(toolsSection) &
          Node.DOCUMENT_POSITION_FOLLOWING &&
        toolsSection.compareDocumentPosition(approach) &
          Node.DOCUMENT_POSITION_FOLLOWING;
      return { tickerInsideTools, tickerInsideServices, order: !!order };
    });
    expect(sectionOrder).toEqual({
      tickerInsideTools: true,
      tickerInsideServices: false,
      order: true,
    });

    const accessibleLabels = await page
      .locator(".tools-ticker__accessible li")
      .allTextContents();
    expect(accessibleLabels).toEqual([...toolsInSpecOrder]);

    await expect(page.locator(".tools-ticker img")).toHaveCount(0);
  });

  test("use cases section shows four workflow titles without activating demos", async ({
    page,
  }) => {
    await page.goto("/");
    const useCases = page.locator("#use-cases");
    await expect(useCases).toBeAttached();

    for (const title of useCaseTitles) {
      await expect(
        useCases.getByRole("heading", { name: title, level: 3 }),
      ).toBeVisible();
    }
  });

  test("prefers-reduced-motion uses static ticker and disables demo pulse", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(".tools-ticker__marquee")).toBeHidden();
    await expect(page.locator(".tools-ticker__static")).toBeVisible();

    const trackAnimation = await page
      .locator(".tools-ticker__track")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(trackAnimation).toBe("none");

    await page.locator("#use-cases").scrollIntoViewIfNeeded();
    await expect(page.locator(".use-case-demo__motion").first()).toBeAttached();
    const demoAnimation = await page
      .locator(".use-case-demo__motion")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(demoAnimation).toBe("none");

    await expect(page.locator(".use-case-demo.is-active")).toHaveCount(0);
  });
});

test.describe("keyboard navigation", () => {
  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip to content/i });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#home")).toBeInViewport();
  });

  test("mobile menu closes on Escape and returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const menu = page.getByRole("button", { name: /menu/i });
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
  });

  test("404 mobile menu exposes primary links", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/does-not-exist");
    const menu = page.getByRole("button", { name: /menu/i });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(
      page.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
  });
});
