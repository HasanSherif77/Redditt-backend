const Notification = require('./notificationModel');

// Get all notifications for the current user
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('user')
      .populate('relatedUser')
      .populate('relatedPost')
      .populate('relatedComment');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.find({ user: req.user._id })
      .populate('user')
      .populate('relatedUser')
      .populate('relatedPost')
      .populate('relatedComment');
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      user: req.user._id
    });
    await notification.save();
    await notification.populate('user');
    await notification.populate('relatedUser');
    await notification.populate('relatedPost');
    await notification.populate('relatedComment');
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    )
      .populate('user')
      .populate('relatedUser')
      .populate('relatedPost')
      .populate('relatedComment');
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
};

