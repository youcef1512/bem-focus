import { expect, test } from "@playwright/test";

test("main routes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /برنامج قصير، واضح/ })).toBeVisible();

  await page.goto("/subjects/math");
  await expect(page.getByRole("heading", { name: /الرياضيات/ })).toBeVisible();

  await page.goto("/lessons/math-geometry");
  await expect(page.getByRole("heading", { name: /رياضيات: المثلثات/ })).toBeVisible();

  await page.goto("/past-exams/math/2025");
  await expect(page.getByRole("heading", { name: /الرياضيات 2025|رياضيات BEM 2025/i })).toBeVisible();

  await page.goto("/downloads");
  await expect(page.getByRole("heading", { name: /التحميلات والطباعة/ })).toBeVisible();

  await page.goto("/history-timeline");
  await expect(page.getByText(/19 مارس 1962/).first()).toBeVisible();
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

test("hosted pdf iframe is present on exam page", async ({ page }) => {
  await page.goto("/past-exams/math/2025");
  await expect(page.locator('iframe[title="paper-math-2025"]')).toBeVisible();
});

test("exam page uses teaching-first coach content instead of OCR output", async ({ page }) => {
  await page.goto("/past-exams/french/2025");
  await expect(page.getByRole("heading", { name: /كيف تخدمي هذه الورقة فعلاً/ })).toBeVisible();
  await expect(page.getByText(/إعادة بناء الامتحان من الصفحات الأصلية/)).toHaveCount(0);
});

test("history recall lab can generate a new set", async ({ page }) => {
  await page.goto("/history-timeline");
  const firstItem = await page.getByTestId("reorder-item").first().innerText();
  await page.getByTestId("practice-refresh").click();
  await expect(page.getByTestId("reorder-item").first()).not.toHaveText(firstItem);
});

test("triangle visual updates the hypotenuse interactively", async ({ page }) => {
  await page.goto("/lessons/math-geometry");
  const before = await page.getByTestId("triangle-hypotenuse").innerText();
  await page.getByTestId("triangle-base-slider").fill("9");
  await expect(page.getByTestId("triangle-hypotenuse")).not.toHaveText(before);
});
