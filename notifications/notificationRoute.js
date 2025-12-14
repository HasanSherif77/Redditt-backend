const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} = require('./notificationController');

// GET /api/notifications - Get all notifications
router.get('/', getAllNotifications);

// GET /api/notifications/:id - Get notification by ID
router.get('/:id', getNotificationById);

// POST /api/notifications - Create new notification
router.post('/', createNotification);

// PATCH /api/notifications/:id - Update notification
router.patch('/:id', updateNotification);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;

