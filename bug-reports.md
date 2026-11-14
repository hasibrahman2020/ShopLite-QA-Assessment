### Bug Report 1: Authentication Bypass with Empty Credentials

- **Title:** System allows user login without entering any credentials
- **Severity:** Critical
- **Priority:** High
- **Category:** Security / Functional

**Description:**
The application fails to validate authentication credentials during the login process. A user can bypass the authentication mechanism by leaving both the Email and Password fields completely blank and clicking the "Login" button, which incorrectly grants access to the protected application routes.

**Steps to Reproduce:**
1. Navigate to the login page (`https://shoplite-qa.netlify.app/app/login`).
2. Leave the "Email" field empty.
3. Leave the "Password" field empty.
4. Click on the "Login" button.

**Expected Result:**
The system denies access, keeps the user on the login page, and displays a validation error message indicating that email and password are required fields.

**Actual Result:**
The system accepts the empty submission, bypasses authentication, and successfully logs the user into the application, granting access to protected routes.

**Specification Reference:** 
- Spec 1.2: "An authentication form accepts an email and password. The system verifies these credentials against stored user data."
- Spec 1.4: "Authentication ensures that users without active sessions cannot view protected routes."

---

### Bug Report 2: Password Remains Visible After Unchecking "Show password"

- **Title:** Password remains visible in plain text after unchecking the "Show password" checkbox
- **Severity:** Medium
- **Priority:** Medium
- **Category:** Functional / Security

**Description:**
On the login page, toggling the "Show password" checkbox displays the entered password in plain text, but unchecking the checkbox fails to mask the characters again. This exposes the user's password on screen against their intent.

**Steps to Reproduce:**
1. Navigate to the login page (`https://shoplite-qa.netlify.app/app/login`).
2. Enter a password into the "Password" field (e.g., `Passw0rd!23`).
3. Check the "Show password" checkbox.
4. Uncheck the "Show password" checkbox.

**Expected Result:**
The password input field reverts to a masked state, hiding the entered characters.

**Actual Result:**
The password input field remains unmasked and continues displaying the password in plain text.

**Specification Reference:**
- Section 1 (Authentication — Show password toggle behavior)

---

### Bug Report 3: Plain-Text Password Stored in Browser Local Storage

- **Title:** User password is stored in plain text inside browser Local Storage
- **Severity:** Critical
- **Priority:** High
- **Category:** Security

**Description:**
Upon logging into the application, the system saves the user's raw, unencrypted password in the browser's `localStorage` under the key `sl_last_password`. Any JavaScript executing on the page or anyone with access to the browser DevTools can read the credential directly.

**Steps to Reproduce:**
1. Navigate to `https://shoplite-qa.netlify.app/app/login`.
2. Enter valid credentials (`qa@shoplite.test` / `Passw0rd!23`) and click "Login".
3. Open Browser DevTools (`F12`) and go to the **Application** tab.
4. Expand **Local storage** and select `https://shoplite-qa.netlify.app`.

**Expected Result:**
Sensitive user credentials such as passwords are never stored in `localStorage` or any client-side web storage in plain text.

**Actual Result:**
The plain-text password (`Passw0rd!23`) is stored and visible under the key `sl_last_password` in `localStorage`.

**Specification Reference:**
- Section 1 (Authentication & Session Security)

---

### Bug Report 4: Broken Product Image for "Vertex Air" (HTTP 404)

- **Title:** Product image for "Vertex Air" fails to load and returns a 404 error
- **Severity:** Medium
- **Priority:** Medium
- **Category:** Usability / Functional

**Description:**
On the Product Catalogue page (`/app/products.html`), the image asset for the "Vertex Air" product fails to load. The browser requests `/app/images/vertex-air.png`, which returns an HTTP `404 (Not Found)` error in the console and displays a broken image icon on the product card.

**Steps to Reproduce:**
1. Log in to ShopLite and navigate to `https://shoplite-qa.netlify.app/app/products.html`.
2. Open Browser DevTools (`F12`) and select the **Console** tab.
3. Locate the "Vertex Air" product card on the page and observe the console logs.

**Expected Result:**
All product images on the catalogue page load with an HTTP 200 status and render properly on their respective product cards.

**Actual Result:**
The request to `https://shoplite-qa.netlify.app/app/images/vertex-air.png` fails with a `404 (Not Found)` error, resulting in a broken product image.

**Specification Reference:**
- Section 2 (Product Catalogue — Product card display)

---

### Bug Report 5: Missing Authentication Guard on Protected Routes After Logout

- **Title:** Unauthenticated user can directly access protected routes (`/app/products.html`) after logout
- **Severity:** Critical
- **Priority:** High
- **Category:** Security

**Description:**
After logging out of the application, navigating directly to protected routes such as `/app/products.html` bypasses session validation. Instead of redirecting the unauthenticated user to `/app/login`, the application loads the full product catalogue page and displays a "Hi, Guest" label alongside an active "Logout" button in the navigation bar.

**Steps to Reproduce:**
1. Log in to ShopLite and click "Logout" in the top-right navigation bar.
2. Enter `https://shoplite-qa.netlify.app/app/products.html` directly into the browser address bar and press Enter.

**Expected Result:**
Users without an active authenticated session are denied access to protected routes and automatically redirected to `/app/login`.

**Actual Result:**
The protected `/app/products.html` page loads directly without authentication, displaying the catalogue and "Hi, Guest" in the header.

**Specification Reference:**
- Spec 1.4: "Authentication ensures that users without active sessions cannot view protected routes. If a user tries to access /app/cart without a session, they are redirected to /app/login."

---

### Bug Report 6: Reflected Cross-Site Scripting (XSS) in Product Search

- **Title:** Search input fails to sanitize HTML/JavaScript payloads, leading to Reflected XSS
- **Severity:** Critical
- **Priority:** High
- **Category:** Security

**Description:**
On the Product Catalogue page (`/app/products.html`), the search bar renders user input directly into the "No products found" message without HTML escaping or sanitization. Entering an HTML payload containing an inline event handler executes arbitrary JavaScript in the user's browser.

**Steps to Reproduce:**
1. Navigate to `https://shoplite-qa.netlify.app/app/products.html`.
2. Enter `<img src=x onerror=alert('XSS')>` into the "Search" input field.
3. Observe the page output.

**Expected Result:**
The search query is sanitized and rendered safely as plain text without executing any HTML tags or JavaScript code.

**Actual Result:**
The browser parses the `<img>` tag, triggers the `onerror` handler, and executes the `alert('XSS')` pop-up.

**Specification Reference:**
- Section 2 (Product Catalogue — Search input handling)
- Section 8 (Security & Input Sanitization)

---

### Bug Report 7: Incorrect Numerical Sorting for "Price: low to high"

- **Title:** "Price: low to high" sorts products lexicographically as strings instead of numerically
- **Severity:** Medium
- **Priority:** Medium
- **Category:** Functional

**Description:**
When sorting products by "Price: low to high" on `/app/products.html`, the application compares prices as alphabetical strings rather than numeric values. Consequently, a product priced at BDT 129999 appears before products priced at BDT 84999 and BDT 99900.

**Steps to Reproduce:**
1. Navigate to `https://shoplite-qa.netlify.app/app/products.html`.
2. Select "Laptop" from the "Category" dropdown.
3. Select "Price: low to high" from the "Sort by" dropdown.
4. Observe the order of the displayed product cards.

**Expected Result:**
Products are sorted in ascending numerical order by price: Aurora 14 Laptop (BDT 84999), Vertex Air 13 (BDT 99900), and Nimbus Pro 16 Laptop (BDT 129999).

**Actual Result:**
Products are ordered lexicographically as Nimbus Pro 16 Laptop (BDT 129999), Aurora 14 Laptop (BDT 84999), and Vertex Air 13 (BDT 99900).

**Specification Reference:**
- Section 2 (Product Catalogue — Price sorting)

---

### Bug Report 8: SAVE10 Coupon Ignores 2,000 BDT Discount Cap and Causes Floating-Point Glitch

- **Title:** Coupon `SAVE10` fails to enforce the 2,000 BDT maximum discount cap and displays unrounded float total
- **Severity:** High
- **Priority:** High
- **Category:** Functional

**Description:**
According to the cart coupon policy ("SAVE10 gives 10% off, capped at 2,000"), applying `SAVE10` to an order exceeding 20,000 BDT must limit the discount to 2,000 BDT. However, on an 84,999 BDT order, the system applies an uncapped 10% discount of 8,499.90 BDT and displays an unrounded IEEE 754 floating-point Grand total (`৳82874.02500000001`).

**Steps to Reproduce:**
1. Add "Aurora 14 Laptop" (Unit price: 84,999 BDT, Qty: 1) to the cart on `/app/cart.html`.
2. Enter `SAVE10` into the "Coupon code" field and click "Apply coupon".
3. Inspect the Discount and Grand total values.

**Expected Result:**
The discount is capped at `৳2,000` and the Grand total is properly rounded to two decimal places.

**Actual Result:**
The discount is applied as `৳8,499.9` and the Grand total renders as `৳82874.02500000001`.

**Specification Reference:**
- Section 5 (Pricing, VAT & Discounts — Coupon rules and rounding)

---

### Bug Report 9: Single "Add to cart" Click Adds Quantity of 2 Instead of 1

- **Title:** Clicking "Add to cart" once increments product quantity by 2 instead of 1
- **Severity:** High
- **Priority:** High
- **Category:** Functional

**Description:**
On the Product Catalogue page (`/app/products.html`), clicking the "Add to cart" button a single time adds 2 units of the selected product to the cart instead of 1. This doubles the item quantities, line totals, and overall cart count.

**Steps to Reproduce:**
1. Navigate to `https://shoplite-qa.netlify.app/app/products.html` with an empty cart (`Cart (0)`).
2. Click the "Add to cart" button once on "Aurora 14 Laptop".
3. Click the "Add to cart" button once on "Pulse X5 Phone".
4. Open `/app/cart.html` and inspect the item quantities.

**Expected Result:**
Each single click on "Add to cart" adds 1 unit of the product to the cart, resulting in a total count of 2 items.

**Actual Result:**
Each single click adds 2 units per product, resulting in a quantity of 2 for each item and a total count of `Cart (4)`.

**Specification Reference:**
- Section 3 (Shopping Cart — Adding items to cart)

---

### Bug Report 10: Client-Side Unit Price Tampering Allowed in Shopping Cart

- **Title:** Product unit prices are editable in the shopping cart, allowing price manipulation and negative totals
- **Severity:** Critical
- **Priority:** High
- **Category:** Security / Functional

**Description:**
On the Shopping Cart page (`/app/cart.html`), product unit prices are rendered inside editable input fields instead of read-only text. A user can alter the unit price to zero (`0`) or negative numbers (e.g., `-10`), causing the system to compute negative line totals, a negative subtotal, and negative VAT, thereby manipulating the final checkout amount.

**Steps to Reproduce:**
1. Add products to the cart and navigate to `https://shoplite-qa.netlify.app/app/cart.html`.
2. Click the "Unit price" input field for "Aurora 14 Laptop" and change the value to `0`.
3. Click the "Unit price" input field for "Pulse X5 Phone" and change the value to `-10`.
4. Observe the updated Line total, Subtotal, VAT (7.5%), and Grand total fields.

**Expected Result:**
Product unit prices are non-editable, read-only values sourced from the product catalogue and cannot be modified by the user in the cart.

**Actual Result:**
The unit price inputs accept arbitrary numeric values including `0` and `-10`, resulting in a negative subtotal (`৳-10`), negative VAT (`৳-0.75`), and an altered grand total (`৳109.25`).

**Specification Reference:**
- Section 3 (Shopping Cart — Item pricing and subtotal calculation)
- Section 5 (Pricing, VAT & Discounts)