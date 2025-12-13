const Comment = require('./commentModel');

// Get all comments for a specific user
const getAllUserComments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const comments = await Comment.find({ userId })
      .populate('userId')
      .populate('postId')
      .populate('parentComment');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a specific post
const getAllPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const comments = await Comment.find({ postId })
      .populate('userId')
      .populate('postId')
      .populate('parentComment');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comment by ID
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('userId')
      .populate('postId')
      .populate('parentComment');
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new comment
const createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    await comment.populate('userId');
    await comment.populate('postId');
    await comment.populate('parentComment');
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('userId')
      .populate('postId')
      .populate('parentComment');
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUserComments,
  getAllPostComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};

