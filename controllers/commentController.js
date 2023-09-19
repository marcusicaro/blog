const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.get_all = asyncHandler(async (req, res, next) => {
  const allComments = await Comment.find({})
    .sort({ timestamp: 1 })
    .populate({ user: 'user', post: 'post' })
    .exec();
  res.json({ comments: allComments });
});

exports.create = asyncHandler(async (req, res, next) => {
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  body('text', 'Text must not be empty.').trim().isLength({ min: 1 }).escape();
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.userId).exec();
    const comment = new Comment({
      title: req.body.title,
      timestamp: new Date(),
      user: user,
      text: req.body.text,
      post: post,
    });
    await comment.save();
    res.json({ message: 'Comment created' });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

exports.get_all_comments_on_a_specific_post = asyncHandler(
  async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ timestamp: 1 })
      .populate({ user: 'user', post: 'post' })
      .exec();
    res.json({ comments: comments });
  }
);

exports.delete = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (req.user.admin === true || req.user._id === comment.user) {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } else {
    res.json({ message: 'You are not authorized to delete this comment' });
  }
});
