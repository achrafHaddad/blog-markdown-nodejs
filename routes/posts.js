const express = require('express');
const { createPost, getAllPosts, getPost, updatePost, deletePost } = require('../controllers/posts');
const { imgUpload, multerError } = require('../config/multer');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:slug', getPost);
router.post('/create', imgUpload.single('image'), createPost, multerError);
router.put('/update/:slug', imgUpload.single('image'), updatePost, multerError);
router.delete('/delete/:id', deletePost);

module.exports = router;
