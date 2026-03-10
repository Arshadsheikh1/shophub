const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  console.error(`[ERROR] ${statusCode}: ${message}`);

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors)
      .map((err) => err.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorMiddleware;
