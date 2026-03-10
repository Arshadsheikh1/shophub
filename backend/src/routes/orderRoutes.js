import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminMiddleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

router.use(adminOnly);

router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.get('/stats/summary', getOrderStats);

export default router;
