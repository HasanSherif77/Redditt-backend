const express = require('express');
const router = express.Router();
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage
} = require('./messageController');

// GET /api/messages - Get all messages
router.get('/', getAllMessages);

// GET /api/messages/:id - Get message by ID
router.get('/:id', getMessageById);

// POST /api/messages - Create new message
router.post('/', createMessage);

// PATCH /api/messages/:id - Update message
router.patch('/:id', updateMessage);

// DELETE /api/messages/:id - Delete message
router.delete('/:id', deleteMessage);

module.exports = router;

