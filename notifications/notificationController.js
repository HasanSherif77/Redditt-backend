const Notification = require('./notificationModel');

// Get all notifications for a specific user
const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await Notification.find({ userId })
      .populate('userId')
      .populate('postId')
      .populate('communityId');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    await notification.populate('userId');
    await notification.populate('postId');
    await notification.populate('communityId');
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getAllNotifications,
  createNotification,
};

