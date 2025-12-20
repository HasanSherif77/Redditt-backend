const express = require('express');
const router = express.Router();
const {
  getAllUserComments,
  getAllPostComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  searchComments
} = require('./commentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /comments/me - Get all comments for the current user
router.get('/me', authenticateToken, getAllUserComments);

// GET /comments/post/:postId - Get all comments for a specific post
router.get('/post/:postId', authenticateToken, getAllPostComments);

// GET /comments/search/:query - Search comments by letters
router.get('/search/:query', authenticateToken, searchComments);

// GET /comments/:id - Get comment by ID
router.get('/:id', authenticateToken, getCommentById);

// POST /api/comments - Create new comment
router.post('/', authenticateToken, createComment);

// PATCH /api/comments/:id - Update comment
router.patch('/:id', authenticateToken, updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', authenticateToken, deleteComment);

// POST /api/comments/:id/upvote - Upvote a comment
router.post('/:id/upvote', authenticateToken, upvoteComment);

// POST /api/comments/:id/downvote - Downvote a comment
router.post('/:id/downvote', authenticateToken, downvoteComment);

module.exports = router;

