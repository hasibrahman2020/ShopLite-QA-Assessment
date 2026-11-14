const { test, expect } = require('@playwright/test');

test.describe('ShopLite Happy Path User Journey', () => {
  test('User can log in, add a product to cart, verify summary, and proceed to checkout', async ({ page }) => {
    // 1. Navigate to login page and authenticate with valid credentials
    await page.goto('/app/login');
    await page.locator('#email').fill('qa@shoplite.test');
    await page.locator('#password').fill('Passw0rd!23');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Verify successful redirect to Product Catalogue
    await expect(page).toHaveURL(/\/app\/products\.html/);
    await expect(page.getByRole('heading', { name: 'Product catalogue' })).toBeVisible();

    // 3. Search for an in-stock product and add to cart
    await page.locator('#q').fill('Aurora');
    const productCard = page.locator('div', { hasText: 'Aurora 14 Laptop' }).first();
    await expect(productCard).toBeVisible();
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // 4. Open Cart page and verify item and pricing summary
    await page.getByRole('link', { name: /Cart/i }).click();
    await expect(page).toHaveURL(/\/app\/cart\.html/);
    await expect(page.getByText('Aurora 14 Laptop')).toBeVisible();
    await expect(page.locator('#ship')).toHaveText('Free');
    await expect(page.getByText(/Grand total/i)).toBeVisible();

    // 5. Proceed to Checkout page
    await page.getByRole('button', { name: 'Proceed to checkout' }).click();
    await expect(page).toHaveURL(/\/app\/checkout\.html/);
  });
});