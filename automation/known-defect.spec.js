const { test, expect } = require('@playwright/test');

test.describe('Known Defect Verification', () => {
  test('BUG-009: Clicking "Add to cart" once should add quantity of 1 instead of 2', async ({ page }) => {
    // 1. Log in to the application
    await page.goto('/app/login');
    await page.locator('#email').fill('qa@shoplite.test');
    await page.locator('#password').fill('Passw0rd!23');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/app\/products\.html/);

    // 2. Click "Add to cart" a single time on Aurora 14 Laptop
    await page.locator('#q').fill('Aurora');
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // 3. Expected per spec: Cart badge updates to Cart (1) and item Qty equals 1
    // Current buggy behavior: Adds 2 units on a single click, causing this assertion to fail
    await expect(page.getByRole('link', { name: 'Cart (1)' })).toBeVisible();

    await page.getByRole('link', { name: /Cart/i }).click();
    await expect(page.locator('#qty').first()).toHaveValue('1');
  });
});