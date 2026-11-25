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

  test("home and privacy have title and meta description", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AI consulting and integration/);
    const homeDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(homeDesc).toMatch(/working solutions/i);

    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Privacy notice/);
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

  test("contact form submit is disabled on preview", async ({ page }) => {
    await page.goto("/#contact");
    await expect(
      page.getByRole("button", { name: "Send inquiry" }),
    ).toBeDisabled();
  });

  test("axe: no serious violations on index", async ({ page }) => {
    await page.goto("/");
    await expectNoSeriousAxeViolations(page);
  });

  test("axe: no serious violations on privacy", async ({ page }) => {
    await page.goto("/privacy");
    await expectNoSeriousAxeViolations(page);
  });

  test("axe: no serious violations on 404", async ({ page }) => {
    await page.goto("/does-not-exist");
    await expectNoSeriousAxeViolations(page);
  });

  test("axe: no serious violations on contact", async ({ page }) => {
    await page.goto("/#contact");
    await expectNoSeriousAxeViolations(page);
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
