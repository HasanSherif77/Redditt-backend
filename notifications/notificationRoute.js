const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  createNotification,
} = require('./notificationController');

// GET /notifications/:userId - Get all notifications for a specific user
router.get('/:userId', getAllNotifications);


// POST /api/notifications - Create new notification
router.post('/', createNotification);


module.exports = router;

