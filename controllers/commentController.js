const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.get_all = asyncHandler(async (req, res, next) => {
  const allComments = await Comment.find({})
    .sort({ timestamp: 1 })
    .populate('user')
    .exec();
  res.json({ comments: allComments });
});

exports.create = asyncHandler(async (req, res, next) => {
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  body('text', 'Text must not be empty.').trim().isLength({ min: 1 }).escape();
  const comment = new Comment({
    content: req.body.title,
    timestamp: new Date(),
    user: req.user._id,
    text: req.body.text,
  });
  try {
    await comment.save();
    res.json({ message: 'Comment created' });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

exports.delete = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (req.user.admin === true || req.user._id === comment.user) {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } else {
    res.json({ message: 'You are not authorized to delete this comment' });
  }
});
