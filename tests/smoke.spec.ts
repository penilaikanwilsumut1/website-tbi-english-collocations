import { expect, test } from "@playwright/test";

test("dashboard exposes the Persiapantubel collocations shell", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "TBI - English Collocations" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navigasi utama" })).toBeVisible();
  await expect(page.getByText("Collocation Bank")).toBeVisible();
  await expect(page.getByText("450", { exact: true })).toBeVisible();
});

test("search finds phrases, partners, and Indonesian meaning", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Pencarian/i }).click();
  await page.getByRole("searchbox", { name: "Cari collocation" }).fill("consist");

  await expect(page.getByRole("heading", { name: "consist of" })).toBeVisible();
  await expect(page.getByText(/terdiri dari/i)).toBeVisible();

  await page.getByRole("searchbox", { name: "Cari collocation" }).fill("make a decision");
  await expect(page.getByRole("heading", { name: "make a decision" })).toBeVisible();
  await expect(page.getByText(/membuat keputusan/i)).toBeVisible();

  await page.getByRole("searchbox", { name: "Cari collocation" }).fill("save energy");
  await expect(page.getByRole("heading", { name: "save energy" })).toBeVisible();
  await expect(page.getByText(/menghemat energi/i)).toBeVisible();
});

test("material and flipcard share package rail behavior", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { exact: true, name: "Materi" }).click();

  await expect(page.getByRole("heading", { name: "Belajar English Collocations" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Collocation Practice 01/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "afraid of" })).toBeVisible();

  await page.getByRole("button", { exact: true, name: "Flipcard" }).click();
  await page.getByRole("button", { name: /Balik kartu afraid/i }).click();

  await expect(page.locator(".flip-back strong").getByText("afraid of")).toBeVisible();
  await expect(page.getByText("takut pada")).toBeVisible();
});

test("test package saves answers and locks after final submit", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Tes$/i }).click();

  await expect(page.getByText(/Coverage: 10\/450 collocation bank/i)).toBeVisible();

  await page
    .locator("#question-collocation-practice-01-q01")
    .getByRole("button", { name: /^A of$/i })
    .click();
  await page.getByRole("button", { name: /Submit final/i }).click();

  await expect(page.getByText("Skor: 1/10")).toBeVisible();
  await expect(
    page.locator("#question-collocation-practice-01-q01").getByText(/Jawaban benar: A/i),
  ).toBeVisible();
});
