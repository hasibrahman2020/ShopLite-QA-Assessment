# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: known-defect.spec.js >> Known Defect Verification >> BUG-009: Clicking "Add to cart" once should add quantity of 1 instead of 2
- Location: known-defect.spec.js:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Cart (1)' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('link', { name: 'Cart (1)' }) with timeout 5000ms
  - waiting for getByRole('link', { name: 'Cart (1)' })

```

```yaml
- text: ShopLite
- navigation:
  - link "Products":
    - /url: products.html
  - link "Cart (2)":
    - /url: cart.html
  - link "Checkout":
    - /url: checkout.html
- text: Hi, qa
- button "Logout"
- heading "Product catalogue" [level=3]
- paragraph: Browse and add items to your cart.
- text: Search
- textbox "Search":
  - /placeholder: Search by product name
  - text: Aurora
- text: Category
- combobox "Category":
  - option "All" [selected]
  - option "Laptop"
  - option "Phone"
  - option "Accessory"
- text: Sort by
- combobox "Sort by":
  - option "Default" [selected]
  - 'option "Price: low to high"'
  - 'option "Price: high to low"'
  - 'option "Name: A to Z"'
  - 'option "Rating: high to low"'
- paragraph: Showing 8 of 8 products
- img "Aurora 14 Laptop"
- text: Aurora 14 Laptop laptop · rating 4.5 BDT 84999
- button "Add to cart"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Known Defect Verification', () => {
  4  |   test('BUG-009: Clicking "Add to cart" once should add quantity of 1 instead of 2', async ({ page }) => {
  5  |     // 1. Log in to the application
  6  |     await page.goto('/app/login');
  7  |     await page.locator('#email').fill('qa@shoplite.test');
  8  |     await page.locator('#password').fill('Passw0rd!23');
  9  |     await page.getByRole('button', { name: 'Login' }).click();
  10 | 
  11 |     await expect(page).toHaveURL(/\/app\/products\.html/);
  12 | 
  13 |     // 2. Click "Add to cart" a single time on Aurora 14 Laptop
  14 |     await page.locator('#q').fill('Aurora');
  15 |     await page.getByRole('button', { name: 'Add to cart' }).first().click();
  16 | 
  17 |     // 3. Expected per spec: Cart badge updates to Cart (1) and item Qty equals 1
  18 |     // Current buggy behavior: Adds 2 units on a single click, causing this assertion to fail
> 19 |     await expect(page.getByRole('link', { name: 'Cart (1)' })).toBeVisible();
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  20 | 
  21 |     await page.getByRole('link', { name: /Cart/i }).click();
  22 |     await expect(page.locator('#qty').first()).toHaveValue('1');
  23 |   });
  24 | });
```