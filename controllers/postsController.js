const Post = require('../models/post');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.get_all = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({})
    .sort({ timestamp: 1 })
    .populate('user')
    .exec();
  res.json({ posts: allPosts });
});

exports.get_one = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('user').exec();
  res.json({ post: post });
});

exports.create = asyncHandler(async (req, res, next) => {
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  body('content', 'Content must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape();
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    timestamp: new Date(),
    user: req.user._id,
  });
  try {
    await post.save();
    res.json({ message: 'Post created' });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

exports.delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (req.user.admin === true) {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } else {
    res.json({ message: 'You are not authorized to delete this post' });
  }
});
