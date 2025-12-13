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

// PUT /api/notifications/:id - Update notification
router.put('/:id', updateNotification);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;

