import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  getOrderPayment,
  retryPayment,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create-order', createPaymentOrder);

router.post('/verify', verifyPayment);

router.get('/status/:paymentId', getPaymentStatus);

router.get('/order/:orderId', getOrderPayment);

router.post('/retry/:paymentId', retryPayment);

router.get('/history', getPaymentHistory);

export default router;
