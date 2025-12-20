const Comment = require('./commentModel');
const Post = require('../posts/postModel');
const Notification = require('../notifications/notificationModel');
const User = require('../users/userModel');

// Get all comments for the current user
const getAllUserComments = async (req, res) => {
  try {
    const comments = await Comment.find({ userId: req.user._id })
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
    const comment = new Comment({
      ...req.body,
      userId: req.user._id
    });
    await comment.save();
    
    // Get the post to find the post owner
    const post = await Post.findById(comment.postId);
    
    // Increment post commentsCount only if parentComment is null (direct comment on post)
    if (!comment.parentComment) {
      await Post.findByIdAndUpdate(
        comment.postId,
        { $inc: { commentsCount: 1 } }
      );
    }
    
    // Create notification for post owner (don't notify if commenting on own post)
    if (post && post.userId.toString() !== req.user._id.toString()) {
      const relatedUser = await User.findById(req.user._id).select('username');
      await Notification.create({
        type: comment.parentComment ? 'reply' : 'comment',
        action: comment.parentComment 
          ? `${relatedUser.username} replied to your comment`
          : `${relatedUser.username} commented on your post`,
        user: post.userId,
        relatedUser: req.user._id,
        relatedPost: comment.postId,
        relatedComment: comment._id
      });
    }
    
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
      { ...req.body },
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

// Upvote comment (increments votes)
const upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    )
      .populate('userId')
      .populate('postId')
      .populate('parentComment');

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Create notification for comment owner (don't notify if upvoting own comment)
    // Handle both populated (object) and unpopulated (ObjectId) userId
    const commentOwnerId = comment.userId._id ? comment.userId._id.toString() : comment.userId.toString();
    if (commentOwnerId !== req.user._id.toString()) {
      const relatedUser = await User.findById(req.user._id).select('username');
      await Notification.create({
        type: 'upvote',
        action: `${relatedUser.username} upvoted your comment`,
        user: comment.userId._id || comment.userId,
        relatedUser: req.user._id,
        relatedComment: comment._id,
        relatedPost: comment.postId
      });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Downvote comment (decrements votes, not below 0)
const downvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.votes = Math.max(0, (comment.votes || 0) - 1);
    await comment.save();
    await comment.populate('userId');
    await comment.populate('postId');
    await comment.populate('parentComment');

    // Create notification for comment owner (don't notify if downvoting own comment)
    // Handle both populated (object) and unpopulated (ObjectId) userId
    const commentOwnerId = comment.userId._id ? comment.userId._id.toString() : comment.userId.toString();
    if (commentOwnerId !== req.user._id.toString()) {
      const relatedUser = await User.findById(req.user._id).select('username');
      await Notification.create({
        type: 'downvote',
        action: `${relatedUser.username} downvoted your comment`,
        user: comment.userId._id || comment.userId,
        relatedUser: req.user._id,
        relatedComment: comment._id,
        relatedPost: comment.postId
      });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search comments by query string (matches content)
const searchComments = async (req, res) => {
  try {
    const q = req.params.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
    const regex = new RegExp(q, 'i');
    const comments = await Comment.find({
      content: regex
    })
      .populate('userId')
      .populate('postId')
      .populate('parentComment')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(comments);
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
  deleteComment,
  upvoteComment,
  downvoteComment,
  searchComments
};

