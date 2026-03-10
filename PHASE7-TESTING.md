# PHASE 7 - Razorpay Payment Integration Testing Guide

## Quick Start

### 1. Install Razorpay SDK

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create `.env` in backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h

RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=wBtI7nT9kL5mP2q8r3s4t5u6v7w8x9y0z
```

Get test credentials from: https://dashboard.razorpay.com/app/keys

### 3. Start Backend Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

---

## Testing with Postman

### Step 1: Register & Login

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Save the token for subsequent requests.**

---

### Step 2: Create an Order

**POST** `/api/orders`

Headers:
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "items": [
    {
      "product": "63abc123def456ghi789jkl0",
      "name": "Laptop",
      "quantity": 1,
      "price": 50000,
      "subtotal": 50000
    }
  ],
  "totalAmount": 50000,
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India",
    "phone": "9876543210"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "63xyz789...",
    "orderNumber": "ORD-1234567890-1",
    "totalAmount": 50000,
    "paymentStatus": "pending",
    "orderStatus": "pending"
  }
}
```

**Save the Order ID for payment.**

---

### Step 3: Create Razorpay Payment Order

**POST** `/api/payments/create-order`

Headers:
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "orderId": "63xyz789abc..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "63payment123...",
    "razorpayOrderId": "order_JG2vXx8Y4nxrz9",
    "amount": 50000,
    "currency": "INR",
    "orderNumber": "ORD-1234567890-1"
  }
}
```

**Important:**
- Save `razorpayOrderId` - needed for frontend
- This creates payment record in database
- Amount is in smallest currency unit (paise for INR)

---

### Step 4: Simulate Frontend Payment

In frontend, collect:
1. Card details (handled by Razorpay hosted checkout)
2. Get `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`

For testing, use Razorpay test cards:
- **Card:** 4111 1111 1111 1111
- **Expiry:** 12/25
- **CVV:** 123

---

### Step 5: Verify Payment

**POST** `/api/payments/verify`

Headers:
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "razorpay_order_id": "order_JG2vXx8Y4nxrz9",
  "razorpay_payment_id": "pay_JG2vZ9s5mK2d8x",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

Response (Success):
```json
{
  "success": true,
  "data": {
    "paymentId": "63payment123...",
    "orderId": "63xyz789...",
    "razorpayPaymentId": "pay_JG2vZ9s5mK2d8x",
    "message": "Payment verified successfully"
  }
}
```

**What happens:**
1. Signature is verified using HMAC-SHA256
2. Payment status changed to "captured"
3. Order payment status changed to "paid"
4. Payment method set to "razorpay"

---

### Step 6: Get Payment Status

**GET** `/api/payments/status/:paymentId`

Headers:
```
Authorization: Bearer YOUR_TOKEN
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "63payment123...",
    "status": "captured",
    "amount": 50000,
    "razorpayPaymentId": "pay_JG2vZ9s5mK2d8x",
    "orderNumber": "ORD-1234567890-1",
    "createdAt": "2024-01-28T12:00:00.000Z"
  }
}
```

Possible statuses:
- `pending` - Payment not yet processed
- `authorized` - Payment authorized (3D Secure)
- `captured` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

### Step 7: Get Order Payment

**GET** `/api/payments/order/:orderId`

Headers:
```
Authorization: Bearer YOUR_TOKEN
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "63payment123...",
    "status": "captured",
    "amount": 50000,
    "razorpayPaymentId": "pay_JG2vZ9s5mK2d8x",
    "razorpayOrderId": "order_JG2vXx8Y4nxrz9",
    "failureReason": null,
    "createdAt": "2024-01-28T12:00:00.000Z",
    "updatedAt": "2024-01-28T12:00:05.000Z"
  }
}
```

---

### Step 8: Retry Failed Payment

**POST** `/api/payments/retry/:paymentId`

Headers:
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "63payment123...",
    "razorpayOrderId": "order_NEW9X8Y7nxrz0",
    "amount": 50000,
    "message": "Payment retry initiated"
  }
}
```

**Retry limits:** Max 3 attempts per payment

---

### Step 9: Get Payment History

**GET** `/api/payments/history?page=1&limit=10&status=captured`

Headers:
```
Authorization: Bearer YOUR_TOKEN
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)
- `status` - Filter by status (optional)

Response:
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "paymentId": "63payment123...",
        "status": "captured",
        "amount": 50000,
        "razorpayPaymentId": "pay_JG2vZ9s5mK2d8x",
        "orderNumber": "ORD-1234567890-1",
        "orderStatus": "processing",
        "createdAt": "2024-01-28T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

## Complete Testing Workflow (cURL)

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Create Order
ORDER_ID=$(curl -s -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "product": "63abc123def456ghi789jkl0",
      "name": "Test Product",
      "quantity": 1,
      "price": 1000,
      "subtotal": 1000
    }],
    "totalAmount": 1000,
    "shippingAddress": {
      "fullName": "Test User",
      "street": "123 Test St",
      "city": "Mumbai",
      "state": "MH",
      "zipCode": "400001",
      "country": "India",
      "phone": "9876543210"
    }
  }' | jq -r '.data._id')

echo "Order ID: $ORDER_ID"

# 3. Create Payment Order
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/payments/create-order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\"
  }")

PAYMENT_ID=$(echo $PAYMENT_RESPONSE | jq -r '.data.paymentId')
RAZORPAY_ORDER_ID=$(echo $PAYMENT_RESPONSE | jq -r '.data.razorpayOrderId')

echo "Payment ID: $PAYMENT_ID"
echo "Razorpay Order ID: $RAZORPAY_ORDER_ID"

# 4. Verify Payment (simulate frontend)
curl -s -X POST http://localhost:5000/api/payments/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"razorpay_order_id\": \"$RAZORPAY_ORDER_ID\",
    \"razorpay_payment_id\": \"pay_test123\",
    \"razorpay_signature\": \"signature123\"
  }" | jq .
```

---

## Error Scenarios

### Missing Token
```json
{
  "success": false,
  "error": "Please provide a token"
}
```

### Order Already Paid
```json
{
  "success": false,
  "error": "Order is already paid"
}
```

### Payment in Progress
```json
{
  "success": false,
  "error": "A payment is already in progress for this order"
}
```

### Invalid Signature
```json
{
  "success": false,
  "error": "Payment signature verification failed"
}
```

### Unauthorized User
```json
{
  "success": false,
  "error": "Unauthorized - Order does not belong to this user"
}
```

### Max Retry Exceeded
```json
{
  "success": false,
  "error": "Maximum retry attempts exceeded. Contact support."
}
```

---

## Database Schema

### Payment Collection

```javascript
{
  _id: ObjectId,
  order: ObjectId,                // Reference to Order
  user: ObjectId,                 // Reference to User
  razorpayOrderId: String,        // Razorpay Order ID
  razorpayPaymentId: String,      // Razorpay Payment ID
  razorpaySignature: String,      // Signature for verification
  amount: Number,                 // Amount in rupees
  currency: String,               // Default: INR
  status: String,                 // pending, authorized, captured, failed, refunded
  description: String,            // Payment description
  notes: Map,                      // Custom notes
  failureReason: String,          // Reason if failed
  receiptId: String,              // Receipt ID
  contactInfo: {
    email: String,
    phone: String
  },
  ipAddress: String,              // Client IP
  userAgent: String,              // Client user agent
  retryCount: Number,             // Retry attempts
  lastRetryAt: Date,              // Last retry timestamp
  createdAt: Date,
  updatedAt: Date
}
```

### Order Fields (Updated)

```javascript
paymentMethod: {
  type: String,
  enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'razorpay']
}
```

---

## Security Considerations

### Signature Verification

✅ Uses HMAC-SHA256
✅ Verifies: `razorpay_order_id|razorpay_payment_id`
✅ Never trusts frontend data
✅ Server-side verification only

### Payment Flow

1. **Frontend** creates checkout with Razorpay
2. **Razorpay** processes payment
3. **Frontend** sends verification to backend
4. **Backend** verifies signature
5. **Backend** updates order status
6. **Frontend** confirms success

### Never Do

❌ Trust payment status from frontend
❌ Store Razorpay secret on frontend
❌ Skip signature verification
❌ Update order without verification
❌ Log sensitive payment data

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/create-order` | Create payment order | Yes |
| POST | `/api/payments/verify` | Verify payment | Yes |
| GET | `/api/payments/status/:id` | Get payment status | Yes |
| GET | `/api/payments/order/:id` | Get order payment | Yes |
| POST | `/api/payments/retry/:id` | Retry payment | Yes |
| GET | `/api/payments/history` | Payment history | Yes |

---

## Razorpay Test Cards

| Card Type | Card Number | Expiry | CVV |
|-----------|-------------|--------|-----|
| Visa | 4111 1111 1111 1111 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |
| Amex | 3782 822463 10005 | 12/25 | 1234 |
| Visa Debit | 6011 1111 1111 1111 | 12/25 | 123 |

OTP for 3D Secure: 111111

---

## Troubleshooting

### Issue: "Cannot find module 'razorpay'"
**Solution:** Run `npm install razorpay`

### Issue: "RAZORPAY_KEY_ID not found"
**Solution:** Check `.env` file has correct credentials

### Issue: "Invalid signature"
**Solution:**
- Verify key_secret is correct
- Check razorpay_order_id and razorpay_payment_id
- Ensure signature format is correct

### Issue: "Order not found"
**Solution:** Use valid Order ID from creation response

### Issue: "Unauthorized"
**Solution:** Include Authorization header with valid token

### Issue: "Payment already paid"
**Solution:** Payment can only be made once per order

---

## Production Checklist

✅ Use live Razorpay credentials
✅ Remove test data from database
✅ Enable HTTPS
✅ Add rate limiting
✅ Log payment events
✅ Setup webhook handlers (for async confirmations)
✅ Monitor payment failures
✅ Setup alerts for failed payments
✅ Regular security audits
✅ Backup payment data regularly

---

## Next Steps (Phase 8+)

- Webhook handling for payment confirmations
- Refund processing
- Payment analytics
- Invoice generation
- Email notifications
- SMS notifications
- Payment retry automation
- Fraud detection

---

**PHASE 7 COMPLETE – READY FOR PHASE 8**
