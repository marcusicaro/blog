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
router.post('/comments/:postId', verifyToken, comment_controller.create);
router.delete('/comments/:commentId', verifyToken, comment_controller.delete);

// users
router.get('/username', verifyToken, user_controller.get_login_data);
router.get('/users/admin', verifyToken, user_controller.get_user_admin_status);
router.delete('/users/:id', verifyToken, user_controller.delete);
router.post('/users/signup', user_controller.create);
router.post('/users/signin', user_controller.signin);
router.post('/users/logout', user_controller.logout);
router.post(
  '/users/admin',
  verifyToken,
  user_controller.change_user_admin_status
);

module.exports = router;
