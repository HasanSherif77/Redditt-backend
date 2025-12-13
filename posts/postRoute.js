const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  upvotePost, 
  downvotePost,
  getPostsByUser,
  getPostsByCommunity
} = require('./postController');

// GET /api/posts - Get all posts
router.get('/', getAllPosts);

// GET /api/posts/user/:userId - Get all posts by a specific user
router.get('/user/:userId', getPostsByUser);

// GET /api/posts/community/:communityId - Get all posts in a specific community
router.get('/community/:communityId', getPostsByCommunity);

// GET /api/posts/:id - Get post by ID
router.get('/:id', getPostById);

// POST /api/posts - Create new post
router.post('/', createPost);

// PUT /api/posts/:id - Update post
router.put('/:id', updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', deletePost);

// POST /api/posts/:id/upvote - Upvote a post
router.post('/:id/upvote', upvotePost);

// POST /api/posts/:id/downvote - Downvote a post
router.post('/:id/downvote', downvotePost);



module.exports = router;

