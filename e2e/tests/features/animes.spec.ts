import { test, expect } from "@playwright/test";


test.describe("Animes page", async () => {
  test.beforeEach("main navigation", async ({ page }) => {
    await page.goto('/animes');

    await expect(page).toHaveURL("http://localhost:4200/animes");
  });

  test("animes page is displayed correctly", async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Popular animes');
  });

  test("animes page contains 25 anime cards", async ({ page }) => {
      const cardsContainer = page.getByTestId('anime-cards-container');

      // Attendre que le container soit visible ET contienne des éléments
      await expect(cardsContainer).toBeVisible();
      await expect(cardsContainer.locator('> *').first()).toBeVisible();
      await expect(cardsContainer.locator('> *').last()).toBeVisible();

      await expect(cardsContainer.locator('> *')).toHaveCount(25);
  });

//   test("Click on card image navigate to that anime specific page", async ({ page }) => {
//   });
});