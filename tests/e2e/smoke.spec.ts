import { expect, test } from "@playwright/test";

test("main routes render", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /برنامج قصير، واضح/ }),
  ).toBeVisible();

  await page.goto("/subjects/math");
  await expect(
    page.getByRole("heading", { name: /الرياضيات/ }),
  ).toBeVisible();

  await page.goto("/lessons/math-geometry");
  await expect(
    page.getByRole("heading", { name: /رياضيات: المثلثات/ }),
  ).toBeVisible();

  await page.goto("/past-exams/math/2025");
  await expect(
    page.getByRole("heading", { name: /الرياضيات 2025|رياضيات BEM 2025/i }),
  ).toBeVisible();

  await page.goto("/downloads");
  await expect(
    page.getByRole("heading", { name: /التحميلات والطباعة/ }),
  ).toBeVisible();
});

test("print css hides the top bar", async ({ page }) => {
  await page.goto("/lessons/math-algebra");
  await page.emulateMedia({ media: "print" });
  const display = await page.locator(".top-bar").evaluate((element) => {
    return window.getComputedStyle(element).display;
  });
  expect(display).toBe("none");
});

test("offline lesson html opens", async ({ page }) => {
  await page.goto("/downloads/lessons/math-algebra.html");
  await expect(page.getByRole("heading", { name: /رياضيات: إصلاح الجبر/ })).toBeVisible();
});
