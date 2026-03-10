# API Response Reference

Complete response examples for all Phase 3 endpoints.

## Authentication Endpoints

### POST /api/auth/register

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4b1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlYzQ5ZjFiMmM3MmI4YzhlNGIxYSIsImlhdCI6MTYyNDgwMzI0OSwiZXhwIjoxNjI0ODg5NjQ5fQ.oLU3yCKQXOqOGvpyJdJiJBYqKjZVqKjQZqKjQKjQoKk"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Password must be at least 8 characters"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Email already in use"
}
```

---

### POST /api/auth/login

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4b1a",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### GET /api/auth/me

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60d5ec49f1b2c72b8c8e4b1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Please provide a token"
}
```

---

## Category Endpoints

### GET /api/categories

**Query Parameters:**
- `isActive` (boolean, default: true)
- `sortBy` (string, default: displayOrder)
- `limit` (number, default: 50)
- `page` (number, default: 1)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "total": 3,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4b1b",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "displayOrder": 1,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "60d5ec49f1b2c72b8c8e4b1c",
      "name": "Clothing",
      "slug": "clothing",
      "description": "Fashion and apparel",
      "displayOrder": 2,
      "isActive": true,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

---

### GET /api/categories/:id (or by slug)

**Request:**
```
GET /api/categories/60d5ec49f1b2c72b8c8e4b1b
GET /api/categories/electronics
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1b",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and gadgets",
    "displayOrder": 1,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Category not found"
}
```

---

### POST /api/categories

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "displayOrder": 1
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1b",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and gadgets",
    "displayOrder": 1,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "error": "Access denied. Admin role required"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Category name already exists"
}
```

---

### PUT /api/categories/:id

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Updated Electronics",
  "displayOrder": 3
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1b",
    "name": "Updated Electronics",
    "slug": "updated-electronics",
    "description": "Electronic devices and gadgets",
    "displayOrder": 3,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

---

### DELETE /api/categories/:id

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1b",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and gadgets",
    "displayOrder": 1,
    "isActive": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:50:00.000Z"
  }
}
```

---

## Product Endpoints

### GET /api/products

**Query Parameters:**
- `category` (string) - Filter by category ID
- `minPrice` (number)
- `maxPrice` (number)
- `sortBy` (string, default: -createdAt)
- `limit` (number, default: 20)
- `page` (number, default: 1)

**Examples:**
```
GET /api/products
GET /api/products?category=60d5ec49f1b2c72b8c8e4b1b&minPrice=50&maxPrice=200&limit=10&page=1
GET /api/products?sortBy=price&limit=5
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4b1d",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life",
      "price": 129.99,
      "discountPrice": 99.99,
      "category": {
        "_id": "60d5ec49f1b2c72b8c8e4b1b",
        "name": "Electronics",
        "slug": "electronics"
      },
      "stock": 50,
      "sku": "SKU-A1B2C3D4",
      "images": [
        {
          "filename": "wireless-headphones-1705320600000-123456789.jpg",
          "path": "/uploads/wireless-headphones-1705320600000-123456789.jpg",
          "uploadedAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "ratings": {
        "average": 4.5,
        "count": 120
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### GET /api/products/:id (or by slug)

**Request:**
```
GET /api/products/60d5ec49f1b2c72b8c8e4b1d
GET /api/products/wireless-headphones
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1d",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    "price": 129.99,
    "discountPrice": 99.99,
    "category": {
      "_id": "60d5ec49f1b2c72b8c8e4b1b",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets"
    },
    "stock": 50,
    "sku": "SKU-A1B2C3D4",
    "images": [
      {
        "filename": "wireless-headphones-1705320600000-123456789.jpg",
        "path": "/uploads/wireless-headphones-1705320600000-123456789.jpg",
        "uploadedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "ratings": {
      "average": 4.5,
      "count": 120
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### GET /api/products/category/:categoryId

**Request:**
```
GET /api/products/category/60d5ec49f1b2c72b8c8e4b1b?limit=10&page=1
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4b1d",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "price": 129.99,
      "discountPrice": 99.99,
      "category": {
        "_id": "60d5ec49f1b2c72b8c8e4b1b",
        "name": "Electronics",
        "slug": "electronics"
      },
      "stock": 50,
      "sku": "SKU-A1B2C3D4",
      "images": [
        {
          "filename": "image.jpg",
          "path": "/uploads/image.jpg"
        }
      ],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### POST /api/products

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Form Data:**
```
name: Wireless Headphones
description: Premium wireless headphones with active noise cancellation and 30-hour battery life
price: 129.99
discountPrice: 99.99
category: 60d5ec49f1b2c72b8c8e4b1b
stock: 50
images: [file1.jpg, file2.jpg, ...]
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1d",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    "price": 129.99,
    "discountPrice": 99.99,
    "category": {
      "_id": "60d5ec49f1b2c72b8c8e4b1b",
      "name": "Electronics",
      "slug": "electronics"
    },
    "stock": 50,
    "sku": "SKU-A1B2C3D4",
    "images": [
      {
        "filename": "wireless-headphones-1705320600000-123456789.jpg",
        "path": "/uploads/wireless-headphones-1705320600000-123456789.jpg",
        "uploadedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "ratings": {
      "average": 0,
      "count": 0
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Product name must be at least 3 characters"
}
```

**Error Response (400 - File):**
```json
{
  "success": false,
  "error": "Only .jpeg, .png, .webp, and .gif formats allowed"
}
```

---

### PUT /api/products/:id

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Form Data (all optional):**
```
name: Updated Product Name
price: 119.99
stock: 45
images: [new_image.jpg]
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1d",
    "name": "Updated Product Name",
    "price": 119.99,
    "stock": 45,
    "images": [
      {
        "filename": "new-image-1705320600000-987654321.jpg",
        "path": "/uploads/new-image-1705320600000-987654321.jpg",
        "uploadedAt": "2024-01-15T10:45:00.000Z"
      }
    ],
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

---

### DELETE /api/products/:id

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4b1d",
    "name": "Wireless Headphones",
    "isActive": false,
    "updatedAt": "2024-01-15T10:50:00.000Z"
  }
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200  | OK | Data retrieved or updated successfully |
| 201  | Created | Resource created successfully |
| 400  | Bad Request | Invalid input or validation error |
| 401  | Unauthorized | Missing or invalid token |
| 403  | Forbidden | Admin access required |
| 404  | Not Found | Resource doesn't exist |
| 409  | Conflict | Duplicate entry (e.g., email exists) |
| 500  | Server Error | Internal server error |

---

## Authentication Header Format

All protected endpoints require:

```
Authorization: Bearer {jwt_token}
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlYzQ5ZjFiMmM3MmI4YzhlNGIxYSIsImlhdCI6MTYyNDgwMzI0OSwiZXhwIjoxNjI0ODg5NjQ5fQ.oLU3yCKQXOqOGvpyJdJiJBYqKjZVqKjQZqKjQKjQoKk
```
