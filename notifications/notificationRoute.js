const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} = require('./notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/notifications - Get all notifications
router.get('/', authenticateToken, getAllNotifications);

// GET /api/notifications/:id - Get notification by ID
router.get('/me', authenticateToken, getNotificationById);

// POST /api/notifications - Create new notification
router.post('/', authenticateToken, createNotification);

// PATCH /api/notifications/:id - Update notification
router.patch('/me', authenticateToken, updateNotification); 

// DELETE /api/notifications/:id - Delete notification
router.delete('/me', authenticateToken, deleteNotification);

module.exports = router;

