// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import AppError from '../utils/errorHandler.js';

// const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return next(new AppError('Please provide a token', 401));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     if (!user.isActive) {
//       return next(new AppError('Account is inactive', 401));
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return next(new AppError('Token expired', 401));
//     }
//     if (error.name === 'JsonWebTokenError') {
//       return next(new AppError('Invalid token', 401));
//     }
//     next(error);
//   }
// };

// export default protect;


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token expired' });
  }
};

export default protect;
