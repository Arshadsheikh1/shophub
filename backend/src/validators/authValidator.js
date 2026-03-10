import AppError from '../utils/errorHandler.js';

export const validateRegister = (data) => {
  const { name, email, password, confirmPassword } = data;

  if (!name || name.trim().length < 2) {
    throw new AppError('Name must be at least 2 characters', 400);
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  if (!password || password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }
};

export const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  if (!password || password.length < 1) {
    throw new AppError('Password is required', 400);
  }
};
