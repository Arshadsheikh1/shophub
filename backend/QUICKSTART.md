# Phase 3 Backend - Quick Start

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
```

## Start Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## File Structure

```
backend/
├── src/
│   ├── config/database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── productValidator.js
│   ├── utils/errorHandler.js
│   └── server.js
├── uploads/                            # Image storage
└── package.json
```

## API Summary

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Categories (Admin-only for create/update/delete)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get by ID or slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Products (Admin-only for create/update/delete)
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get by ID or slug
- `GET /api/products/category/:categoryId` - Get by category
- `POST /api/products` - Create product with images (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

## Testing Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Create Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices",
    "displayOrder": 1
  }'
```

### Create Product with Images
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Headphones" \
  -F "description=Premium wireless headphones" \
  -F "price=129.99" \
  -F "category=CATEGORY_ID" \
  -F "stock=50" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### Get All Products
```bash
curl http://localhost:5000/api/products?limit=10&page=1
```

## Key Features

✅ JWT Authentication
✅ Role-based access control (admin)
✅ Image upload with validation
✅ MongoDB integration
✅ Product filtering & pagination
✅ Soft deletes (data preservation)
✅ Auto-generated slugs & SKUs
✅ Comprehensive error handling
✅ Input validation

## Database Setup

For MongoDB on localhost:
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb

# Windows - Download and install MongoDB
```

Or use MongoDB Atlas (cloud):
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Add to `.env` as MONGODB_URI

## Production Deployment

1. Update `.env`:
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Use MongoDB Atlas URI

2. Deploy to:
   - Heroku
   - Railway
   - Vercel (with serverless functions)
   - AWS EC2
   - DigitalOcean

## Documentation

- **README.md** - Full API documentation with examples
- **PHASE3-TESTING.md** - Comprehensive testing guide
- **PHASE3-SUMMARY.md** - Architecture overview

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**"Cannot find module" error:**
- Run `npm install`

**Token errors:**
- Include `Authorization: Bearer TOKEN` header
- Use token from login response

**Image upload fails:**
- Create `uploads` directory
- Check file size (max 5MB)
- Only .jpg, .png, .webp, .gif allowed

## Next Steps

Phase 3 is complete. Phase 4 will include:
- Shopping cart system
- Order management
- Payment processing
- User reviews & ratings
