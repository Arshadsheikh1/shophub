// import Product from '../models/Product.js';
// import AppError from '../utils/errorHandler.js';

// /* =========================
//    CREATE PRODUCT (ADMIN)
// ========================= */
// export const createProduct = async (req, res, next) => {
//   try {
//     const { name, price, description, stock, category } = req.body;

//     if (!name || !price || !description || !stock || !category) {
//       return next(new AppError('All fields are required', 400));
//     }

//     const product = await Product.create({
//       name,
//       price: Number(price),
//       description,
//       stock: Number(stock),
//       category,
//       // match schema images array
//       images: req.file
//         ? [
//             {
//               filename: req.file.filename,
//               path: `/uploads/${req.file.filename}`,
//             },
//           ]
//         : [],
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Product created successfully',
//       data: product,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    GET ALL PRODUCTS
// ========================= */
// export const getProducts = async (req, res, next) => {
//   try {
//     const products = await Product.find().populate('category');

//     res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    GET PRODUCT BY ID
// ========================= */
// export const getProductById = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id).populate('category');

//     if (!product) {
//       return next(new AppError('Product not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    UPDATE PRODUCT (ADMIN)
// ========================= */
// export const updateProduct = async (req, res, next) => {
//   try {
//     const { name, price, description, stock, category } = req.body;

//     const updateData = {};

//     if (name !== undefined) updateData.name = name;
//     if (price !== undefined) updateData.price = Number(price);
//     if (description !== undefined) updateData.description = description;
//     if (stock !== undefined) updateData.stock = Number(stock);
//     if (category !== undefined) updateData.category = category;

//     if (req.file) {
//       updateData.images = [
//         {
//           filename: req.file.filename,
//           path: `/uploads/${req.file.filename}`,
//         },
//       ];
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('category');

//     if (!product) {
//       return next(new AppError('Product not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Product updated successfully',
//       data: product,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    DELETE PRODUCT (ADMIN)
// ========================= */
// export const deleteProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return next(new AppError('Product not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Product deleted successfully',
//     });
//   } catch (error) {
//     next(error);
//   }
// };
import Product from '../models/Product.js';
import AppError from '../utils/errorHandler.js';

/* =========================
   CREATE PRODUCT (ADMIN)
========================= */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, category } = req.body;

    if (!name || !price || !description || !stock || !category) {
      return next(new AppError('All fields are required', 400));
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      category,
      // match schema images array
      images: req.file
        ? [
            {
              filename: req.file.filename,
              path: `/uploads/${req.file.filename}`,
            },
          ]
        : [],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL PRODUCTS
   Supports: category, search, page, limit
========================= */
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const filter = {};

    // Filter by category when provided
    if (category) {
      filter.category = category;
    }

    // Search by product name (case-insensitive)
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category').skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      total,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE PRODUCT (ADMIN)
========================= */
export const updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock, category } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (category !== undefined) updateData.category = category;

    if (req.file) {
      updateData.images = [
        {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
        },
      ];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE PRODUCT (ADMIN)
========================= */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

