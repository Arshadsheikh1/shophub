# Phase 4 - Cart & Order Testing Guide

Complete step-by-step testing guide for Cart and Order systems.

## Prerequisites

1. MongoDB running
2. Backend server running (`npm run dev`)
3. Postman installed (or use cURL)
4. Admin account created with test products

## Test Workflow

### Step 1: Create Test User & Get Token

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Customer",
  "email": "customer@test.com",
  "password": "TestPass123!",
  "confirmPassword": "TestPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Test Customer",
      "email": "customer@test.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

Save the `JWT_TOKEN` for authenticated requests.

---

## CART TESTING

All cart endpoints require authentication header:
```
Authorization: Bearer JWT_TOKEN
```

### Test 2.1: Get Empty Cart

```bash
GET http://localhost:5000/api/cart
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": "USER_ID",
    "items": [],
    "totalPrice": 0
  }
}
```

### Test 2.2: Get Product ID (from Phase 3)

First, get a product to add to cart:

```bash
GET http://localhost:5000/api/products?limit=1
```

**Response includes:**
```json
{
  "data": [
    {
      "_id": "PRODUCT_ID",
      "name": "Wireless Headphones",
      "price": 129.99,
      "discountPrice": 99.99,
      "stock": 50
    }
  ]
}
```

Save the `PRODUCT_ID`.

### Test 2.3: Add Product to Cart

```bash
POST http://localhost:5000/api/cart/add
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "_id": "CART_ID",
    "user": "USER_ID",
    "items": [
      {
        "product": {
          "_id": "PRODUCT_ID",
          "name": "Wireless Headphones",
          "price": 129.99
        },
        "quantity": 2,
        "price": 99.99,
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalPrice": 199.98
  }
}
```

### Test 2.4: Add Multiple Products

Add a second product:

```bash
GET http://localhost:5000/api/products?limit=2
```

Get the second product ID and add it:

```bash
POST http://localhost:5000/api/cart/add
Content-Type: application/json

{
  "productId": "PRODUCT_ID_2",
  "quantity": 1
}
```

### Test 2.5: Get Cart

```bash
GET http://localhost:5000/api/cart
```

**Response shows both items with updated totalPrice**

### Test 2.6: Update Cart Item Quantity

```bash
PUT http://localhost:5000/api/cart/update
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 5
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "items": [
      {
        "product": {...},
        "quantity": 5,
        "price": 99.99
      }
    ],
    "totalPrice": 599.95
  }
}
```

### Test 2.7: Remove Item from Cart (set quantity to 0)

```bash
PUT http://localhost:5000/api/cart/update
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 0
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "data": {
    "items": [
      {
        "product": "PRODUCT_ID_2"
      }
    ],
    "totalPrice": 150.00
  }
}
```

### Test 2.8: Remove by Product ID

```bash
DELETE http://localhost:5000/api/cart/remove/PRODUCT_ID_2
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "data": {
    "items": [],
    "totalPrice": 0
  }
}
```

### Test 2.9: Clear Entire Cart

Add items again first:

```bash
DELETE http://localhost:5000/api/cart/clear
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "user": "USER_ID",
    "items": [],
    "totalPrice": 0
  }
}
```

### Test 2.10: Cart Validation - Insufficient Stock

```bash
POST http://localhost:5000/api/cart/add
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "quantity": 1000
}
```

**Expected Error (400):**
```json
{
  "success": false,
  "error": "Only 50 items in stock"
}
```

### Test 2.11: Cart Validation - Invalid Product

```bash
POST http://localhost:5000/api/cart/add
Content-Type: application/json

{
  "productId": "INVALID_ID",
  "quantity": 1
}
```

**Expected Error (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Test 2.12: Cart Validation - Inactive Product

Admin temporarily disables product, then try adding it:

```bash
POST http://localhost:5000/api/cart/add
Content-Type: application/json

{
  "productId": "DISABLED_PRODUCT_ID",
  "quantity": 1
}
```

**Expected Error (400):**
```json
{
  "success": false,
  "error": "Product is not available"
}
```

---

## ORDER TESTING

### Setup: Add Items to Cart

```bash
POST http://localhost:5000/api/cart/add
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}

POST http://localhost:5000/api/cart/add
{
  "productId": "PRODUCT_ID_2",
  "quantity": 1
}
```

### Test 3.1: Create Order

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "credit_card",
  "notes": "Please deliver in the morning"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "ORDER_ID",
    "user": "USER_ID",
    "orderNumber": "ORD-1705320600000-1",
    "items": [
      {
        "product": "PRODUCT_ID",
        "name": "Wireless Headphones",
        "sku": "SKU-A1B2C3D4",
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      }
    ],
    "totalAmount": 349.97,
    "shippingAddress": {
      "fullName": "John Doe",
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phone": "+1234567890"
    },
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

Save the `ORDER_ID` and `orderNumber`.

### Test 3.2: Verify Cart is Cleared

```bash
GET http://localhost:5000/api/cart
```

**Expected Response - empty cart:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalPrice": 0
  }
}
```

### Test 3.3: Verify Stock Reduced

```bash
GET http://localhost:5000/api/products/PRODUCT_ID
```

**Stock should be reduced by 2:**
```json
{
  "data": {
    "stock": 48
  }
}
```

### Test 3.4: Get User Orders

```bash
GET http://localhost:5000/api/orders/my
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "ORDER_ID",
      "orderNumber": "ORD-1705320600000-1",
      "totalAmount": 349.97,
      "orderStatus": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Test 3.5: Get Order by ID

```bash
GET http://localhost:5000/api/orders/ORDER_ID
```

**Response includes full order details**

### Test 3.6: Filter Orders by Status

```bash
GET http://localhost:5000/api/orders/my?status=pending
GET http://localhost:5000/api/orders/my?paymentStatus=paid
```

### Test 3.7: Order Pagination

```bash
GET http://localhost:5000/api/orders/my?limit=5&page=1
```

### Test 3.8: Cancel Order (User)

```bash
PUT http://localhost:5000/api/orders/ORDER_ID/cancel
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderStatus": "cancelled",
    "cancellationReason": "Changed my mind"
  }
}
```

**Verify stock is restored:**
```bash
GET http://localhost:5000/api/products/PRODUCT_ID
```

Stock should be back to 50.

### Test 3.9: Cannot Cancel Shipped Order

Create a new order, then as admin, update it to shipped status, then try to cancel as user:

```bash
PUT http://localhost:5000/api/orders/ORDER_ID/cancel
```

**Expected Error (400):**
```json
{
  "success": false,
  "error": "Cannot cancel shipped or delivered orders"
}
```

---

## ADMIN TESTING

Create an admin account (manually in MongoDB or via admin tools).

Admin Token obtained via login:
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

### Test 4.1: Get All Orders (Admin)

```bash
GET http://localhost:5000/api/orders
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "orderNumber": "ORD-1705320600000-1",
      "user": {
        "email": "customer@test.com",
        "name": "Test Customer"
      },
      "totalAmount": 349.97,
      "orderStatus": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Test 4.2: Filter Orders (Admin)

```bash
GET http://localhost:5000/api/orders?status=pending
GET http://localhost:5000/api/orders?paymentStatus=paid
GET http://localhost:5000/api/orders?userId=USER_ID
```

### Test 4.3: Update Order Status (Admin)

```bash
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "orderStatus": "processing",
  "paymentStatus": "paid",
  "trackingNumber": "1Z999AA10123456784"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "orderStatus": "processing",
    "paymentStatus": "paid",
    "trackingNumber": "1Z999AA10123456784"
  }
}
```

### Test 4.4: Ship Order

```bash
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "orderStatus": "shipped",
  "trackingNumber": "1Z999AA10123456784"
}
```

### Test 4.5: Deliver Order

```bash
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "orderStatus": "delivered"
}
```

### Test 4.6: Get Order Statistics (Admin)

```bash
GET http://localhost:5000/api/orders/stats/summary
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 25,
    "totalRevenue": 8742.50,
    "ordersByStatus": [
      { "_id": "pending", "count": 5 },
      { "_id": "processing", "count": 8 },
      { "_id": "shipped", "count": 10 },
      { "_id": "delivered", "count": 2 }
    ]
  }
}
```

---

## SECURITY TESTING

### Test 5.1: Cannot Access Cart Without Token

```bash
GET http://localhost:5000/api/cart
```

**Expected Error (401):**
```json
{
  "success": false,
  "error": "Please provide a token"
}
```

### Test 5.2: Cannot Create Order Without Token

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "shippingAddress": {...}
}
```

**Expected Error (401):**
```json
{
  "success": false,
  "error": "Please provide a token"
}
```

### Test 5.3: Cannot Access Admin Endpoints as User

User tries to get all orders:

```bash
GET http://localhost:5000/api/orders
Authorization: Bearer USER_TOKEN
```

**Expected Error (403):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required"
}
```

### Test 5.4: Cannot View Other User's Orders

User A tries to view User B's order:

```bash
GET http://localhost:5000/api/orders/USER_B_ORDER_ID
Authorization: Bearer USER_A_TOKEN
```

**Expected Error (403):**
```json
{
  "success": false,
  "error": "Access denied"
}
```

---

## VALIDATION TESTING

### Test 6.1: Invalid Shipping Address

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "shippingAddress": {
    "fullName": "J",
    "street": "123",
    "city": "NY",
    "state": "N",
    "zipCode": "10",
    "country": "U",
    "phone": "123"
  }
}
```

**Expected Error (400):**
```json
{
  "success": false,
  "error": "Full name must be at least 2 characters"
}
```

### Test 6.2: Empty Cart Order

```bash
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "shippingAddress": {...}
}
```

(with empty cart)

**Expected Error (400):**
```json
{
  "success": false,
  "error": "Cart is empty"
}
```

### Test 6.3: Invalid Order Status Update

```bash
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "orderStatus": "invalid_status"
}
```

**Expected Error (400):**
```json
{
  "success": false,
  "error": "Invalid order status: invalid_status"
}
```

---

## EDGE CASES

### Test 7.1: Stock Depletion During Checkout

1. Add 50 units to cart (product has 50)
2. Another user buys 30 units
3. Try to checkout with 50 units

**Expected Error:**
```json
{
  "success": false,
  "error": "Insufficient stock for product. Only 20 available"
}
```

### Test 7.2: Product Disabled During Checkout

1. Add product to cart
2. Admin disables product
3. Try to checkout

**Expected Error:**
```json
{
  "success": false,
  "error": "Product is no longer available"
}
```

### Test 7.3: Order with Multiple Items, Partial Stock

1. Add 2 items to cart
2. Item 1 has stock, Item 2 doesn't have enough
3. Try to checkout

**Expected Error:**
```json
{
  "success": false,
  "error": "Insufficient stock for 'Product Name'. Only X available"
}
```

### Test 7.4: Duplicate Order Prevention

Place same order twice rapidly - should create 2 separate orders (no deduplication).

---

## POSTMAN COLLECTION SETUP

### Environment Variables

```json
{
  "baseUrl": "http://localhost:5000",
  "userToken": "",
  "adminToken": "",
  "productId": "",
  "orderId": ""
}
```

### Pre-request Script (for Token)

```javascript
// Add to requests that need token
const token = pm.environment.get("userToken");
pm.request.headers.add({
  key: "Authorization",
  value: `Bearer ${token}`
});
```

---

## Load Testing (Optional)

### Simulate Multiple Users Creating Orders

```bash
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/orders \
    -H "Authorization: Bearer TOKEN_$i" \
    -H "Content-Type: application/json" \
    -d '{
      "shippingAddress": {
        "fullName": "User $i",
        "street": "123 Street",
        "city": "City",
        "state": "ST",
        "zipCode": "12345",
        "phone": "+12345678901"
      }
    }'
done
```

---

## Troubleshooting

**Cart not found:**
- Cart is created automatically on first add
- Try adding a product first

**Order fails with empty cart:**
- Add items to cart first
- Verify cart has items: `GET /api/cart`

**Stock not updated:**
- Check order status (should be completed)
- Verify product exists and is active

**Cannot cancel delivered order:**
- This is intentional - only pending/processing can be cancelled
- Try with a recent order

**Admin endpoints return 403:**
- Verify user role is 'admin'
- Check in MongoDB: `db.users.findOne({email: "admin@example.com"})`
- Should have `"role": "admin"`

---

**Phase 4 Testing Complete**
