import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminMiddleware.js';
import { getDashboard } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboard);

export default router;
