# PHASE 6 - Quick Start Guide

## Admin Panel Setup & Testing

### Prerequisites
- Phase 5 frontend already running
- Admin account credentials
- Backend API with admin endpoints

### Getting Started

1. **Start Development Server**
```bash
npm run dev
```

2. **Login with Admin Account**
- Navigate to http://localhost:5173/login
- Use admin credentials (email & password)
- Click "Login"

3. **Access Admin Panel**
- After login, see "Admin" link in navbar (yellow background)
- Click "Admin"
- Taken to admin dashboard at /admin

### Dashboard
- View total users
- View total products
- View total orders
- View total revenue
- See recent orders table

### Product Management

**Add New Product:**
1. Click "Products" in sidebar
2. Click "Add Product" button
3. Fill in product details:
   - Name (required)
   - Price in rupees (required)
   - Discount price (optional)
   - Stock quantity (required)
   - Category (optional)
   - Description (optional)
   - Image upload (optional)
4. Click "Create Product"
5. See success message
6. Redirected to products list

**Edit Product:**
1. On products list, find product
2. Click edit icon (pencil)
3. Form pre-fills with product data
4. Make changes
5. Can change image
6. Click "Update Product"
7. See success message

**Delete Product:**
1. On products list, find product
2. Click delete icon (trash)
3. Confirm deletion in dialog
4. Product removed
5. See success message

**Search Products:**
1. On products list
2. Enter search term
3. Click search icon or press enter
4. Table filters results

### Order Management

**View All Orders:**
1. Click "Orders" in sidebar
2. See all orders in table

**Filter Orders:**
1. Click status filter buttons
2. Options: All, pending, processing, shipped, delivered, cancelled
3. Table updates to show filtered orders

**Update Order Status:**
1. Find order in table
2. Click status dropdown (colored pill)
3. Select new status
4. Status updates immediately
5. See success notification

**View Order Details:**
1. Find order in table
2. Click view icon (eye)
3. See full order details:
   - Order number and date
   - Customer name and email
   - Shipping address
   - All items in order
   - Totals
   - Current status
4. Can update status here too

### Mobile Testing

**Hamburger Menu:**
1. On mobile screen
2. Click hamburger icon (top-left)
3. Sidebar slides in
4. Click item to navigate
5. Sidebar closes

**Responsive Tables:**
1. Scroll horizontally for table columns
2. All data remains readable
3. Forms stack properly

### Logout

1. Click logout button in sidebar
2. Redirected to home page
3. All admin privileges revoked
4. Can log back in if needed

---

## Testing Scenarios

### Scenario 1: Admin Dashboard
1. Login as admin
2. Click Admin link
3. Verify dashboard loads
4. Check stat cards display numbers
5. Check recent orders show

### Scenario 2: Add Product
1. Navigate to admin/products
2. Click Add Product
3. Fill form completely
4. Upload image
5. Submit
6. Verify product appears in list

### Scenario 3: Edit Product
1. On products list
2. Click edit on any product
3. Change name and price
4. Click update
5. Verify changes in list

### Scenario 4: Order Management
1. Go to orders page
2. See all orders listed
3. Click status dropdown
4. Change status to shipped
5. Verify update
6. Click view to see details
7. See all information

---

## Common Issues

**Admin link not showing:**
- Make sure logged in with admin account
- Check user role is 'admin'
- Logout and login again

**Dashboard stats not loading:**
- Check backend is running
- Verify admin endpoint is available
- Check browser console for errors

**Product image not uploading:**
- Check file is valid image
- Check file size
- Verify backend handles multipart/form-data

**Order status not updating:**
- Verify backend endpoint working
- Check JWT token valid
- Refresh page to verify update

**Access denied to admin panel:**
- Must be logged in
- Must have admin role
- Non-admins redirected to home

---

## Keyboard Shortcuts

- Click on product/order row for details
- Tab through form fields
- Enter to search or submit forms

---

## Tips & Tricks

1. **Bulk Actions:** Coming in Phase 7
2. **CSV Export:** Coming in Phase 7
3. **Advanced Filters:** Coming in Phase 7
4. **Batch Upload:** Coming in Phase 7
5. **Sales Analytics:** Coming in Phase 7

---

## Mobile Considerations

- Sidebar is hamburger menu on mobile
- Tables scroll horizontally
- Forms are full-width and stacked
- All buttons are touch-friendly
- Test on actual mobile device

---

## API Integration

All admin features connect to backend:

- Dashboard stats from `/admin/dashboard`
- Products CRUD via `/admin/products`
- Orders management via `/admin/orders`
- Categories via `/admin/categories`

Ensure backend implements all endpoints.

---

## Build & Deploy

```bash
# Development
npm run dev

# Production Build
npm run build

# Test Build Locally
npm run preview
```

---

## Next Steps (Phase 7)

- User management
- Analytics dashboard
- Inventory management
- Bulk operations
- Advanced reporting

---

**PHASE 6 COMPLETE – READY FOR PHASE 7**
