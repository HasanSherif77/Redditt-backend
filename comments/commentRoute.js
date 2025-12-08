const express = require('express');
const router = express.Router();
const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
} = require('./commentController');

// GET /api/comments - Get all comments
router.get('/', getAllComments);

// GET /api/comments/:id - Get comment by ID
router.get('/:id', getCommentById);

// POST /api/comments - Create new comment
router.post('/', createComment);

// PUT /api/comments/:id - Update comment
router.put('/:id', updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', deleteComment);

module.exports = router;

