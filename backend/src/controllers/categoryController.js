// import Category from '../models/Category.js';
// import AppError from '../utils/errorHandler.js';
// import { validateCategory } from '../validators/productValidator.js';

// export const getCategories = async (req, res, next) => {
//   try {
//     const { isActive = true, sortBy = 'displayOrder', limit = 50, page = 1 } = req.query;

//     let query = Category.find();

//     if (isActive !== 'false') {
//       query = query.where({ isActive: true });
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const total = await Category.countDocuments(query);

//     const categories = await query
//       .sort(sortBy)
//       .skip(skip)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       count: categories.length,
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / parseInt(limit)),
//       data: categories,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getCategoryById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const category = await Category.findOne({
//       $or: [{ _id: id }, { slug: id }],
//       isActive: true,
//     });

//     if (!category) {
//       return next(new AppError('Category not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: category,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const createCategory = async (req, res, next) => {
//   try {
//     validateCategory(req.body);

//     const category = await Category.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: 'Category created successfully',
//       data: category,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return next(new AppError('Category name already exists', 409));
//     }
//     next(error);
//   }
// };

// export const updateCategory = async (req, res, next) => {
//   try {
//     if (req.body.name || req.body.description) {
//       validateCategory(req.body);
//     }

//     const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!category) {
//       return next(new AppError('Category not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Category updated successfully',
//       data: category,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return next(new AppError('Category name already exists', 409));
//     }
//     next(error);
//   }
// };

// export const deleteCategory = async (req, res, next) => {
//   try {
//     const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

//     if (!category) {
//       return next(new AppError('Category not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Category deleted successfully',
//       data: category,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


import Category from '../models/Category.js';
import AppError from '../utils/errorHandler.js';

/* =========================
   GET ALL CATEGORIES
========================= */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET CATEGORY BY ID
========================= */
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   CREATE CATEGORY (ADMIN)
========================= */
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return next(new AppError('Category name is required', 400));
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return next(new AppError('Category already exists', 409));
    }

    const category = await Category.create({
      name: name.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE CATEGORY (ADMIN)
========================= */
export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return next(new AppError('Category name is required', 400));
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE CATEGORY (ADMIN)
========================= */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
