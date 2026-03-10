// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import AppError from '../utils/errorHandler.js';
// import { validateRegister, validateLogin } from '../validators/authValidator.js';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '24h',
//   });
// };

// export const register = async (req, res, next) => {
//   try {
//     validateRegister(req.body);

//     const { name, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return next(new AppError('Passwords do not match', 400));
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return next(new AppError('Email already in use', 409));
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     validateLogin(req.body);

//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//       return next(new AppError('Invalid email or password', 401));
//     }

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return next(new AppError('Invalid email or password', 401));
//     }

//     if (!user.isActive) {
//       return next(new AppError('Account is inactive', 401));
//     }

//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getCurrentUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isActive: user.isActive,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import AppError from '../utils/errorHandler.js';
// import { validateRegister, validateLogin } from '../validators/authValidator.js';

// /* =========================
//    TOKEN GENERATOR (UPDATED)
//    ========================= */
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role }, // 👈 role added
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRE || '24h',
//     }
//   );
// };

// /* =========================
//    REGISTER (NO CHANGE)
//    ========================= */
// export const register = async (req, res, next) => {
//   try {
//     validateRegister(req.body);

//     const { name, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return next(new AppError('Passwords do not match', 400));
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return next(new AppError('Email already in use', 409));
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     const token = generateToken(user);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    USER LOGIN (UPDATED TOKEN)
//    ========================= */
// export const login = async (req, res, next) => {
//   try {
//     validateLogin(req.body);

//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//       return next(new AppError('Invalid email or password', 401));
//     }

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return next(new AppError('Invalid email or password', 401));
//     }

//     if (!user.isActive) {
//       return next(new AppError('Account is inactive', 401));
//     }

//     const token = generateToken(user);

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    ✅ ADMIN LOGIN (NEW)
//    ========================= */
// export const adminLogin = async (req, res, next) => {
//   try {
//     validateLogin(req.body);

//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//       return next(new AppError('Invalid email or password', 401));
//     }

//     if (user.role !== 'admin') {
//       return next(new AppError('Access denied: Admin only', 403));
//     }

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return next(new AppError('Invalid email or password', 401));
//     }

//     if (!user.isActive) {
//       return next(new AppError('Account is inactive', 401));
//     }

//     const token = generateToken(user);

//     res.status(200).json({
//       success: true,
//       message: 'Admin login successful',
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role, // 👈 admin
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* =========================
//    CURRENT USER (NO CHANGE)
//    ========================= */
// export const getCurrentUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isActive: user.isActive,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/errorHandler.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

/* =========================
   TOKEN GENERATOR
   ========================= */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '24h',
    }
  );
};

/* =========================
   REGISTER (NO CHANGE)
   ========================= */
export const register = async (req, res, next) => {
  try {
    validateRegister(req.body);

    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 409));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // always "user"
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   👤 USER LOGIN (ADMIN BLOCKED)
   ========================= */
export const login = async (req, res, next) => {
  try {
    validateLogin(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // 🔴 IMPORTANT FIX: BLOCK ADMIN HERE
    if (user.role === 'admin') {
      return next(
        new AppError('Please login from admin panel', 403)
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account is inactive', 401));
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // 👤 ALWAYS "user"
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   👑 ADMIN LOGIN (ONLY ADMIN)
   ========================= */
export const adminLogin = async (req, res, next) => {
  try {
    validateLogin(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (user.role !== 'admin') {
      return next(new AppError('Access denied: Admin only', 403));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account is inactive', 401));
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // 👑 admin
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   CURRENT USER
   ========================= */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
