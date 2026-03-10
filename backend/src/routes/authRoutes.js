// import express from 'express';
// import { register, login, getCurrentUser } from '../controllers/authController.js';
// import protect from '../middlewares/authMiddleware.js';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getCurrentUser);

// export default router;
import express from 'express';
import {
  register,
  login,
  adminLogin,      // 👈 NEW
  getCurrentUser,
} from '../controllers/authController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

/* ===== USER AUTH ===== */
router.post('/register', register);
router.post('/login', login);

/* ===== ADMIN AUTH ===== */
router.post('/admin/login', adminLogin); // 👈 REAL ADMIN LOGIN

/* ===== CURRENT USER ===== */
router.get('/me', protect, getCurrentUser);

export default router;

