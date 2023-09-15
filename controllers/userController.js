const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.create = asyncHandler(async (req, res, next) => {
  body('username', 'Username must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  body('password', 'Password must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  body('email', 'Email must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  try {
    await user.save();
    res.json({ message: 'User created' });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

exports.delete = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (req.user.admin === true || req.user._id === user._id) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } else {
    res.json({ message: 'You are not authorized to delete this user' });
  }
});
