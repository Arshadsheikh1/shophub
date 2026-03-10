# PHASE 5 - Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- Backend running on http://localhost:5000
- npm or yarn package manager

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser

### 3. Test the Application

**Register a new account:**
- Go to /register
- Fill in name, email, password
- Click Register
- Should redirect to home

**Browse Products:**
- Click "Products" in navbar
- View product grid
- Click on a product to see details
- Use search bar to search products

**Add to Cart:**
- On product detail page
- Select quantity (1-available stock)
- Click "Add to Cart"
- See cart count increase in navbar

**Checkout:**
- Click cart icon → Go to cart
- Review items
- Click "Proceed to Checkout"
- Fill shipping address
- Select payment method
- Click "Place Order"

**View Orders:**
- Click "Orders" in navbar (after login)
- See all your orders
- Click "View Details" for more info

---

## Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
├── context/         # State management (Auth, Cart)
├── services/        # API client (axios)
├── utils/           # Helper functions
├── App.tsx          # Main routing
└── index.css        # Global styles
```

---

## Available Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

---

## Environment Configuration

File: `.env`

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Change the URL if your backend is on a different port.

---

## API Connection

The app connects to backend endpoints:

```
POST   /auth/register
POST   /auth/login
GET    /products
GET    /products/:id
GET    /categories
GET    /cart
POST   /cart/add
PUT    /cart/update
DELETE /cart/remove/:id
POST   /orders
GET    /orders/my
```

**Make sure your backend is running before testing!**

---

## Features Available

- ✅ User registration & login
- ✅ Browse products
- ✅ Product search
- ✅ Category filtering
- ✅ Shopping cart
- ✅ Checkout
- ✅ Order history
- ✅ Order status tracking

---

## Responsive Design

The app is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px-1024px)
- Mobile (<768px)

Test on mobile using browser DevTools.

---

## Troubleshooting

### App won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend connection failed
- Check .env file
- Verify backend is running
- Check port number (default: 5000)
- Check browser console for errors

### Cart not updating
- Ensure you're logged in
- Check Network tab in DevTools
- Verify backend cart endpoint working

### Page not found
- Make sure all routes exist
- Clear browser cache
- Restart dev server

---

## Building for Production

```bash
npm run build
```

Output files in `dist/` directory ready to deploy.

---

## Key Files to Modify

| File | Purpose | Modify to... |
|------|---------|------------|
| .env | API URL | Change backend URL |
| src/App.tsx | Routes | Add new pages |
| src/pages/ | Page content | Add new features |
| src/components/ | UI components | Style changes |
| src/utils/format.ts | Formatting | Change formats |

---

## Common Customizations

### Change Color Scheme
Edit Tailwind classes in components (blue-600 → your color)

### Change Logo
Edit in Navbar.tsx component

### Add Navigation Items
Edit Navbar.tsx and Footer.tsx

### Change Default Values
Edit context providers

---

## Performance Tips

- Keep dev server running during development
- Use browser DevTools for debugging
- Check Network tab for API calls
- Monitor Console for errors

---

## Next Steps

1. Run the application
2. Test all features
3. Verify backend connection
4. Create test accounts
5. Test checkout flow
6. View orders

---

**Ready to start? Run `npm run dev` now!**
