import { expect, test } from "@playwright/test";

test.describe("live contact inquiry", () => {
  test("shows success when inquiry is accepted", async ({ page }) => {
    await page.route("**/api/inquiry", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sent: true, rejected: false }),
      });
    });

    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Jane SMB");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Inquiry").fill("We want help with intake forms.");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByRole("status")).toContainText("Inquiry sent");
  });

  test("shows field errors for validation_failed", async ({ page }) => {
    await page.route("**/api/inquiry", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "validation_failed",
          fields: { email: "Enter a valid email address." },
        }),
      });
    });

    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Alex");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Inquiry").fill("Hello");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByRole("alert")).toContainText("Check the fields below");
    await expect(page.locator("#email-error")).toContainText(
      "Enter a valid email address.",
    );
  });

  test("shows delivery failure for 502", async ({ page }) => {
    await page.route("**/api/inquiry", async (route) => {
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "delivery_failed" }),
      });
    });

    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Sam");
    await page.getByLabel("Email").fill("sam@riverbend.co");
    await page.getByLabel("Inquiry").fill("Need integration help.");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByRole("alert")).toContainText("Could not send right now");
  });

  test("does not show success when submission is rejected (BR-07)", async ({
    page,
  }) => {
    await page.route("**/api/inquiry", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sent: false, rejected: true }),
      });
    });

    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Bot");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Inquiry").fill("Spam");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByRole("alert")).toContainText("Could not send");
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("booking link opens in a new tab when configured", async ({ page }) => {
    await page.goto("/#contact");
    const bookingLink = page.getByRole("link", {
      name: "Open booking calendar",
    });
    if ((await bookingLink.count()) === 0) {
      test.skip();
    }
    await expect(bookingLink).toHaveAttribute("target", "_blank");
  });
});