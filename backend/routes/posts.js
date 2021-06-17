const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/check-auth");
const postController = require('../controllers/post');
const fileMiddleware = require('../middleware/file');

router.post('', authMiddleware, fileMiddleware.extractimage, postController.createPost);

router.get('', postController.getAllPosts);

router.get('/:id', postController.getPostbyId);

router.put('/:id', authMiddleware, fileMiddleware.extractimage, postController.updatePost);

router.delete('/:id', authMiddleware, postController.deletePost);


module.exports = router;
