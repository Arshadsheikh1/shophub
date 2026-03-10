import AppError from '../utils/errorHandler.js';

export const validateCategory = (data) => {
  const { name, description } = data;

  if (!name || name.trim().length < 2) {
    throw new AppError('Category name must be at least 2 characters', 400);
  }

  if (name.length > 50) {
    throw new AppError('Category name cannot exceed 50 characters', 400);
  }

  if (description && description.length > 500) {
    throw new AppError('Description cannot exceed 500 characters', 400);
  }
};

export const validateProduct = (data) => {
  const { name, description, price, discountPrice, category, stock } = data;

  if (!name || name.trim().length < 3) {
    throw new AppError('Product name must be at least 3 characters', 400);
  }

  if (name.length > 100) {
    throw new AppError('Product name cannot exceed 100 characters', 400);
  }

  if (!description || description.trim().length < 10) {
    throw new AppError('Product description must be at least 10 characters', 400);
  }

  if (description.length > 2000) {
    throw new AppError('Description cannot exceed 2000 characters', 400);
  }

  if (!price || isNaN(price) || price < 0) {
    throw new AppError('Please provide a valid price', 400);
  }

  if (discountPrice && (isNaN(discountPrice) || discountPrice > price)) {
    throw new AppError('Discount price cannot exceed regular price', 400);
  }

  if (!category) {
    throw new AppError('Please select a category', 400);
  }

  if (!stock || isNaN(stock) || stock < 0) {
    throw new AppError('Please provide a valid stock quantity', 400);
  }
};
