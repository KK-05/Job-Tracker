const ApiError = require('../utils/ApiError');

/**
 * Global error handler middleware.
 * Catches all errors and returns a consistent JSON response.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Postgres unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'A record with this value already exists',
    });
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Referenced resource not found',
    });
  }

  // Default 500
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

module.exports = errorHandler;
