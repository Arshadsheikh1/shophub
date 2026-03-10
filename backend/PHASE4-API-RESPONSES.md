# Phase 4 - Cart & Order API Responses

Complete response examples for all Cart and Order endpoints.

## CART ENDPOINTS

### GET /api/cart

Get user's shopping cart.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b2a",
    "user": "60d5ec49f1b2c72b8c8e4b1a",
    "items": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4b2b",
        "product": {
          "_id": "60d5ec49f1b2c72b8c8e4b1d",
          "name": "Wireless Headphones",
          "sku": "SKU-A1B2C3D4",
          "price": 129.99,
          "discountPrice": 99.99,
          "stock": 50
        },
        "quantity": 2,
        "price": 99.99,
        "addedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4b2c",
        "product": {
          "_id": "60d5ec49f1b2c72b8c8e4b1e",
          "name": "USB-C Cable",
          "sku": "SKU-X1Y2Z3W4",
          "price": 19.99,
          "stock": 100
        },
        "quantity": 1,
        "price": 19.99,
        "addedAt": "2024-01-15T10:35:00.000Z"
      }
    ],
    "totalPrice": 219.97,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Empty Cart Response (200):**
```json
{
  "success": true,
  "data": {
    "user": "60d5ec49f1b2c72b8c8e4b1a",
    "items": [],
    "totalPrice": 0
  }
}
```

---

### POST /api/cart/add

Add product to cart.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "productId": "60d5ec49f1b2c72b8c8e4b1d",
  "quantity": 2
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b2a",
    "user": "60d5ec49f1b2c72b8c8e4b1a",
    "items": [
      {
        "product": {
          "_id": "60d5ec49f1b2c72b8c8e4b1d",
          "name": "Wireless Headphones",
          "price": 129.99,
          "discountPrice": 99.99
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalPrice": 199.98
  }
}
```

**Error - Insufficient Stock (400):**
```json
{
  "success": false,
  "error": "Only 5 items in stock"
}
```

**Error - Product Not Found (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**Error - Product Unavailable (400):**
```json
{
  "success": false,
  "error": "Product is not available"
}
```

---

### PUT /api/cart/update

Update cart item quantity.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "productId": "60d5ec49f1b2c72b8c8e4b1d",
  "quantity": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "items": [
      {
        "product": {
          "_id": "60d5ec49f1b2c72b8c8e4b1d",
          "name": "Wireless Headphones"
        },
        "quantity": 5,
        "price": 99.99
      }
    ],
    "totalPrice": 499.95
  }
}
```

**Remove Item (quantity: 0):**
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

---

### DELETE /api/cart/remove/:productId

Remove specific product from cart.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Request:**
```
DELETE /api/cart/remove/60d5ec49f1b2c72b8c8e4b1d
```

**Success Response (200):**
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

---

### DELETE /api/cart/clear

Clear entire cart.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "user": "60d5ec49f1b2c72b8c8e4b1a",
    "items": [],
    "totalPrice": 0
  }
}
```

---

## ORDER ENDPOINTS

### POST /api/orders

Create new order from cart.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+12345678901"
  },
  "paymentMethod": "credit_card",
  "notes": "Please deliver in the morning"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b3a",
    "user": "60d5ec49f1b2c72b8c8e4b1a",
    "orderNumber": "ORD-1705320600000-1",
    "items": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4b3b",
        "product": "60d5ec49f1b2c72b8c8e4b1d",
        "name": "Wireless Headphones",
        "sku": "SKU-A1B2C3D4",
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      },
      {
        "_id": "60d5ec49f1b2c72b8c8e4b3c",
        "product": "60d5ec49f1b2c72b8c8e4b1e",
        "name": "USB-C Cable",
        "sku": "SKU-X1Y2Z3W4",
        "quantity": 1,
        "price": 19.99,
        "subtotal": 19.99
      }
    ],
    "totalAmount": 219.97,
    "shippingAddress": {
      "fullName": "John Doe",
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phone": "+12345678901"
    },
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "notes": "Please deliver in the morning",
    "createdAt": "2024-01-15T10:40:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Error - Empty Cart (400):**
```json
{
  "success": false,
  "error": "Cart is empty"
}
```

**Error - Insufficient Stock (400):**
```json
{
  "success": false,
  "error": "Insufficient stock for 'Wireless Headphones'. Only 5 available"
}
```

**Error - Product Unavailable (400):**
```json
{
  "success": false,
  "error": "Product 'Laptop' is no longer available"
}
```

**Error - Invalid Address (400):**
```json
{
  "success": false,
  "error": "Full name must be at least 2 characters"
}
```

---

### GET /api/orders/my

Get user's orders.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Query Parameters:**
- `status` - Filter by order status (pending, processing, shipped, delivered, cancelled)
- `paymentStatus` - Filter by payment status (pending, paid, failed, cancelled)
- `limit` - Items per page (default: 10)
- `page` - Page number (default: 1)

**Examples:**
```
GET /api/orders/my
GET /api/orders/my?status=pending
GET /api/orders/my?paymentStatus=paid
GET /api/orders/my?limit=5&page=2
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "total": 5,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4b3a",
      "orderNumber": "ORD-1705320600000-1",
      "items": [
        {
          "product": "60d5ec49f1b2c72b8c8e4b1d",
          "name": "Wireless Headphones",
          "sku": "SKU-A1B2C3D4",
          "quantity": 2,
          "price": 99.99,
          "subtotal": 199.98
        }
      ],
      "totalAmount": 219.97,
      "shippingAddress": {
        "fullName": "John Doe",
        "city": "New York",
        "state": "NY"
      },
      "paymentMethod": "credit_card",
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "createdAt": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

---

### GET /api/orders/:id

Get specific order by ID.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Request:**
```
GET /api/orders/60d5ec49f1b2c72b8c8e4b3a
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b3a",
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4b1a",
      "email": "customer@test.com",
      "name": "John Doe"
    },
    "orderNumber": "ORD-1705320600000-1",
    "items": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4b3b",
        "product": {
          "_id": "60d5ec49f1b2c72b8c8e4b1d",
          "name": "Wireless Headphones",
          "sku": "SKU-A1B2C3D4"
        },
        "quantity": 2,
        "price": 99.99,
        "subtotal": 199.98
      }
    ],
    "totalAmount": 219.97,
    "shippingAddress": {
      "fullName": "John Doe",
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phone": "+12345678901"
    },
    "paymentMethod": "credit_card",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "notes": "Please deliver in the morning",
    "createdAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Error - Not Found (404):**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**Error - Access Denied (403):**
```json
{
  "success": false,
  "error": "Access denied"
}
```

---

### PUT /api/orders/:id/cancel

Cancel order (user or admin).

**Headers:**
```
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "reason": "Changed my mind"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b3a",
    "orderStatus": "cancelled",
    "paymentStatus": "failed",
    "cancellationReason": "Changed my mind",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

**Error - Already Cancelled (400):**
```json
{
  "success": false,
  "error": "Order is already cancelled"
}
```

**Error - Cannot Cancel Shipped (400):**
```json
{
  "success": false,
  "error": "Cannot cancel shipped or delivered orders"
}
```

---

## ADMIN ENDPOINTS

### GET /api/orders

Get all orders (admin only).

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `status` - Filter by order status
- `paymentStatus` - Filter by payment status
- `userId` - Filter by user ID
- `limit` - Items per page (default: 20)
- `page` - Page number (default: 1)

**Examples:**
```
GET /api/orders
GET /api/orders?status=pending
GET /api/orders?paymentStatus=paid
GET /api/orders?userId=60d5ec49f1b2c72b8c8e4b1a
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4b3a",
      "orderNumber": "ORD-1705320600000-1",
      "user": {
        "_id": "60d5ec49f1b2c72b8c8e4b1a",
        "email": "customer@test.com",
        "name": "John Doe"
      },
      "totalAmount": 219.97,
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "createdAt": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

**Error - Not Admin (403):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required"
}
```

---

### PUT /api/orders/:id/status

Update order status (admin only).

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "orderStatus": "processing",
  "paymentStatus": "paid",
  "trackingNumber": "1Z999AA10123456784",
  "notes": "Processing started"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b3a",
    "orderStatus": "processing",
    "paymentStatus": "paid",
    "trackingNumber": "1Z999AA10123456784",
    "notes": "Processing started",
    "updatedAt": "2024-01-15T10:50:00.000Z"
  }
}
```

**Error - Invalid Status (400):**
```json
{
  "success": false,
  "error": "Invalid order status: invalid_status"
}
```

**Error - Cannot Cancel Paid Order (400):**
```json
{
  "success": false,
  "error": "Cannot cancel a paid order. Request refund instead."
}
```

---

### GET /api/orders/stats/summary

Get order statistics (admin only).

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 45,
    "totalRevenue": 12500.75,
    "ordersByStatus": [
      {
        "_id": "pending",
        "count": 5
      },
      {
        "_id": "processing",
        "count": 10
      },
      {
        "_id": "shipped",
        "count": 22
      },
      {
        "_id": "delivered",
        "count": 8
      },
      {
        "_id": "cancelled",
        "count": 0
      }
    ]
  }
}
```

---

## ERROR RESPONSE FORMATS

### Common Errors

**Unauthorized (401):**
```json
{
  "success": false,
  "error": "Please provide a token"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Order not found"
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "error": "Full name must be at least 2 characters"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Street address must be at least 5 characters, Phone number format invalid"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## AUTHENTICATION HEADER FORMAT

All protected endpoints require:

```
Authorization: Bearer JWT_TOKEN
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlYzQ5ZjFiMmM3MmI4YzhlNGIxYSIsImlhdCI6MTYyNDgwMzI0OSwiZXhwIjoxNjI0ODg5NjQ5fQ.oLU3yCKQXOqOGvpyJdJiJBYqKjZVqKjQZqKjQKjQoKk
```

Obtain token from login response.

---

## HTTP STATUS CODES

| Code | Meaning | Example |
|------|---------|---------|
| 200  | OK | Data retrieved or updated successfully |
| 201  | Created | Order created successfully |
| 400  | Bad Request | Invalid input or validation error |
| 401  | Unauthorized | Missing or invalid token |
| 403  | Forbidden | Admin access required or access denied |
| 404  | Not Found | Order/Product not found |
| 500  | Server Error | Internal server error |

---

**Phase 4 API Responses Complete**
