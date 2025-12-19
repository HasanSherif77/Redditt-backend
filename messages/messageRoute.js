const express = require('express');
const router = express.Router();
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage
} = require('./messageController');

const { authenticateToken } = require('../middleware/authMiddleware');

// Custom middleware to check message ownership
const checkMessageOwnership = async (req, res, next) => {
  try {
    const Message = require('./messageModel');
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender can modify the message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only modify your own messages' });
    }

    req.message = message;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================
   PROTECTED ROUTES
===================== */

// Get all messages for current user
router.get('/', authenticateToken, getAllMessages);

// Get specific message (user must be sender or receiver)
router.get('/:id', authenticateToken, getMessageById);

// Create new message
router.post('/', authenticateToken, createMessage);

// Update message (only sender can update)
router.put('/:id', authenticateToken, checkMessageOwnership, updateMessage);

// Delete message (only sender can delete)
router.delete('/:id', authenticateToken, checkMessageOwnership, deleteMessage);

module.exports = router;