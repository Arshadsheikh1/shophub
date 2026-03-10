// import AppError from '../utils/errorHandler.js';

// const adminOnly = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return next(new AppError('Access denied. Admin role required', 403));
//   }
//   next();
// };

// export default adminOnly;

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access only' });
  }
};

export default adminOnly;

