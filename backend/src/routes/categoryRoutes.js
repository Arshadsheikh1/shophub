import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import protect from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.use(protect);
router.use(adminOnly);

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
