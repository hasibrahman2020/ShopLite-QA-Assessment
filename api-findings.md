# ShopLite Mock API Testing Findings

During the exploratory API testing of the local Mock REST API (`http://127.0.0.1:4000`), several critical backend vulnerabilities were identified. These defects indicate a lack of server-side validation and broken access controls.

---

### 1. Sensitive Data Exposure & Broken Access Control on Admin Endpoint
- **Endpoint:** `GET /api/admin/users`
- **Severity:** Critical
- **Category:** Security / Broken Access Control (OWASP Top 10)

**Description:**
The `/api/admin/users` endpoint lacks authentication and authorization checks. Unlike the `/api/admin/orders` endpoint which validates the `admin` role token, this endpoint is completely public. An unauthenticated user can query this endpoint and retrieve the full user database, including plain-text passwords and email addresses of all customers and administrators.

**Steps to Reproduce:**
1. Open Postman or run a cURL command.
2. Send a `GET` request to `http://127.0.0.1:4000/api/admin/users` without any Authorization header.
3. Observe the `200 OK` response returning the complete `USERS` array.

**Impact:**
Complete account takeover of any user (including admins) and massive data breach.

---

### 2. Client-Side Price Tampering in Cart (Trusting Client Input)
- **Endpoint:** `POST /api/cart`
- **Severity:** Critical
- **Category:** Business Logic / Insecure Direct Object Reference

**Description:**
The `/api/cart` endpoint trusts client-provided pricing data. When adding an item to the cart, the server checks if `body.price` is defined. If the client passes a custom price (e.g., `0` or negative values) in the JSON payload, the server overrides the actual database price (`product.price`) with the client's input without any validation.

**Steps to Reproduce:**
1. Send a `POST` request to `http://127.0.0.1:4000/api/cart`.
2. Include the following JSON payload:
   ```json
   {
     "productId": "p1",
     "qty": 1,
     "price": 0
   }