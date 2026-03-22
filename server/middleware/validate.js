const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware that checks express-validator results.
 * Returns a 400 if there are validation errors.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw ApiError.badRequest(messages.join('. '));
  }
  next();
};

module.exports = validate;
