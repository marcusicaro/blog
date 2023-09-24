const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.get_all = asyncHandler(async (req, res, next) => {
  try {
    const allPosts = await Post.find({})
      .sort({ timestamp: 1 })
      .populate('user')
      .exec();
    res.json({ posts: allPosts });
  } catch (err) {
    console.log(err);
  }
});

exports.get_one = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('user').exec();
    res.json({ post: post });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
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
  try {
    const user = await User.findById(req.userId).exec();

    if (user.admin === false) {
      return res.status(400).json({ error: 'user is not allowed to post' });
    }
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      user: user,
    });

    await post.save();
    res.json({ message: 'Post created' });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

exports.delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (req.user.admin === true || req.user._id === post.user) {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } else {
    res.json({ message: 'You are not authorized to delete this post' });
  }
});
