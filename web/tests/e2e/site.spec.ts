import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const sections = [
  { id: "services", label: "Services" },
  { id: "approach", label: "Approach" },
  { id: "use-cases", label: "Use cases" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

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

  test("contact form is enabled for live inquiry", async ({ page }) => {
    await page.goto("/#contact");
    await expect(
      page.getByRole("button", { name: "Send inquiry" }),
    ).toBeEnabled();
  });

  test("axe: no serious violations on index", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious).toEqual([]);
  });

  test("axe: no serious violations on privacy", async ({ page }) => {
    await page.goto("/privacy");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious).toEqual([]);
  });
});
