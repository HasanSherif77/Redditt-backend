const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('./postController');

// GET /api/posts - Get all posts
router.get('/', getAllPosts);

// GET /api/posts/:id - Get post by ID
router.get('/:id', getPostById);

// POST /api/posts - Create new post
router.post('/', createPost);

// PUT /api/posts/:id - Update post
router.put('/:id', updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', deletePost);

module.exports = router;

