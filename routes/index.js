var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postsController');
const user_controller = require('../controllers/userController');

// posts
router.get('/posts', post_controller.get_all);
router.get('/posts/:id', post_controller.get_one);
router.post('/posts', post_controller.create);
router.delete('/posts/:id', post_controller.delete);

module.exports = router;
