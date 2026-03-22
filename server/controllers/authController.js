const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const { generateToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;

/**
 * POST /api/auth/signup
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await UserModel.findByEmail(email);
  if (existing) {
    throw ApiError.badRequest('Email already registered');
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ name, email, password_hash });
  const token = generateToken({ id: user.id, email: user.email });

  res.status(201).json({
    success: true,
    data: { token, user },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken({ id: user.id, email: user.email });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    },
  });
});

/**
 * GET /api/auth/me
 */
const me = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json({ success: true, data: user });
});

module.exports = { signup, login, me };
