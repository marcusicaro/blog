var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postsController');
const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');
const verifyToken = require('../middlewares/verify');

// posts
router.get('/posts', post_controller.get_all);
router.get('/posts/:id', post_controller.get_one);
router.post('/posts', verifyToken, post_controller.create);
router.delete('/posts/:id', verifyToken, post_controller.delete);

// comments
router.get(
  '/comments/:id',
  comment_controller.get_all_comments_on_a_specific_post
);
router.get('/comments', comment_controller.get_all);
router.post('/comments/:id', verifyToken, comment_controller.create);
router.delete('/comments/:id', verifyToken, comment_controller.delete);

// users
router.post('/users', user_controller.create);
router.post('/users/signin', user_controller.signin);
router.delete('/users/:id', verifyToken, user_controller.delete);

module.exports = router;
