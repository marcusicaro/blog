const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    try {
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      });
      const result = await user.save();
      res.json({ message: 'User created' });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  });
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

exports.authenticate = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username, password }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      'your_secret_key_here',
      { expiresIn: '1h' }
    );

    // Send the token in the response
    res.json({ token });
  });
});
