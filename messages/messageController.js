const Message = require('./messageModel');

// Get all messages for the current user
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('sender', 'username email')
    .populate('receiver', 'username email')
    .sort({ createdAt: -1 });
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get message by ID (user must be sender or receiver)
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'username email')
      .populate('receiver', 'username email');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Check if user is sender or receiver
    if (
      message.sender._id.toString() !== req.user._id.toString() &&
      message.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized to view this message' });
    }
    
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new message
const createMessage = async (req, res) => {
  try {
    const { content, receiver } = req.body;
    
    if (!content || !receiver) {
      return res.status(400).json({ error: 'Content and receiver are required' });
    }
    
    // Cannot send message to yourself
    if (receiver === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }
    
    const message = new Message({
      content,
      sender: req.user._id,
      receiver
    });
    
    await message.save();
    
    // Populate sender and receiver details
    await message.populate('sender', 'username email');
    await message.populate('receiver', 'username email');
    
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update message (only sender can update)
const updateMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        content,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    )
    .populate('sender', 'username email')
    .populate('receiver', 'username email');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage
};