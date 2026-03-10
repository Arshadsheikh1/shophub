// import express from 'express';
// import {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } from '../controllers/productController.js';
// import protect from '../middlewares/authMiddleware.js';
// import restrictTo from '../middlewares/roleMiddleware.js';
// import upload from '../middlewares/uploadMiddleware.js';

// const router = express.Router();

// // =================
// // PUBLIC
// // =================

// router.get('/products', getProducts);
// router.get('/products/:id', getProductById);

// // =================
// // ADMIN PROTECTED
// // =================

// router.post(
//   '/products',
//   protect,
//   restrictTo('admin'),
//   upload.single('image'),
//   createProduct
// );

// router.put(
//   '/products/:id',
//   protect,
//   restrictTo('admin'),
//   upload.single('image'),
//   updateProduct
// );

// router.delete(
//   '/products/:id',
//   protect,
//   restrictTo('admin'),
//   deleteProduct
// );

// export default router;
import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import protect from '../middlewares/authMiddleware.js';
import restrictTo from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// =================
// PUBLIC
// =================

router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// =================
// ADMIN PROTECTED
// =================

router.post(
  '/products',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  createProduct
);

router.put(
  '/products/:id',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  updateProduct
);

router.delete(
  '/products/:id',
  protect,
  restrictTo('admin'),
  deleteProduct
);

export default router;
