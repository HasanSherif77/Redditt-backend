const express = require('express');
const router = express.Router();
const {
  getAllUserComments,
  getAllPostComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
} = require('./commentController');

// GET /comments/user/:userId - Get all comments for a specific user
router.get('/user/:userId', getAllUserComments);

// GET /comments/post/:postId - Get all comments for a specific post
router.get('/post/:postId', getAllPostComments);

// GET /comments/:id - Get comment by ID
router.get('/:id', getCommentById);

// POST /api/comments - Create new comment
router.post('/', createComment);

// PATCH /api/comments/:id - Update comment
router.patch('/:id', updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', deleteComment);

module.exports = router;

