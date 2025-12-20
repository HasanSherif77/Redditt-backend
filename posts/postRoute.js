const express = require('express');
const router = express.Router();
const {
  getMyFeed,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  upvotePost, 
  downvotePost,
  getPostsByUser,
  getPostsByUserId,
  getPostsByCommunity,
  searchPosts
} = require('./postController');
const { authenticateToken, optionalAuthenticateToken } = require('../middleware/authMiddleware');

// GET /api/posts - Get my feed (all posts if not authenticated, custom feed if authenticated)
router.get('/', optionalAuthenticateToken, getMyFeed);

// GET /api/posts/me - Get all posts by the current user
router.get('/me', authenticateToken, getPostsByUser);

// GET /api/posts/community/:communityId - Get all posts in a specific community
router.get('/community/:communityId', authenticateToken, getPostsByCommunity);

// GET /api/posts/user/:userId - Get all posts by a specific user
router.get('/user/:userId', authenticateToken, getPostsByUserId);

// GET /api/posts/search/:query - Search posts by letters
router.get('/search/:query', optionalAuthenticateToken, searchPosts);

// GET /api/posts/:id - Get post by ID
router.get('/:id', authenticateToken, getPostById);

// POST /api/posts - Create new post
router.post('/', authenticateToken, createPost);

// PATCH /api/posts/:id - Update post
router.patch('/:id', authenticateToken, updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', authenticateToken, deletePost);

// POST /api/posts/:id/upvote - Upvote a post
router.post('/:id/upvote', authenticateToken, upvotePost);

// POST /api/posts/:id/downvote - Downvote a post
router.post('/:id/downvote', authenticateToken, downvotePost);



module.exports = router;

