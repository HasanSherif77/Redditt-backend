const Post = require('./postModel');
const Notification = require('../notifications/notificationModel');
const User = require('../users/userModel');

// Get my feed (custom posts: joined communities first, then rest)
// If authenticated: returns custom feed (joined communities first)
// If not authenticated: returns all posts sorted by date
const getMyFeed = async (req, res) => {
  try {
    // If user is not authenticated, return all posts
    if (!req.user || !req.user._id) {
      const allPosts = await Post.find()
        .populate('userId')
        .populate('communityId')
        .sort({ createdAt: -1 }); // Sort by newest first
      return res.status(200).json(allPosts);
    }

    // User is authenticated - return custom feed
    // Get user's joined communities
    const user = await User.findById(req.user._id);
    if (!user) {
      // If user not found, fallback to all posts
      const allPosts = await Post.find()
        .populate('userId')
        .populate('communityId')
        .sort({ createdAt: -1 });
      return res.status(200).json(allPosts);
    }

    const joinedCommunityIds = user.joinedCommunities || [];

    // Get posts from joined communities, sorted by createdAt (newest first)
    const joinedCommunityPosts = await Post.find({
      communityId: { $in: joinedCommunityIds }
    })
      .populate('userId')
      .populate('communityId')
      .sort({ createdAt: -1 });

    // Get posts from communities user hasn't joined
    const otherPosts = await Post.find({
      communityId: { $nin: joinedCommunityIds }
    })
      .populate('userId')
      .populate('communityId')
      .sort({ createdAt: -1 });

    // Combine: joined community posts first, then rest
    const customFeed = [...joinedCommunityPosts, ...otherPosts];

    res.status(200).json(customFeed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId')
      .populate('communityId');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      userId: req.user._id
    });
    await post.save();
    await post.populate('userId');
    await post.populate('communityId');
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('userId').populate('communityId');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upvote post (increments votesCount)
const upvotePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { votesCount: 1 } },
      { new: true }
    ).populate('userId').populate('communityId');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create notification for post owner (don't notify if upvoting own post)
    // Handle both populated (object) and unpopulated (ObjectId) userId
    const postOwnerId = post.userId._id ? post.userId._id.toString() : post.userId.toString();
    if (postOwnerId !== req.user._id.toString()) {
      const relatedUser = await User.findById(req.user._id).select('username');
      await Notification.create({
        type: 'upvote',
        action: `${relatedUser.username} upvoted your post`,
        user: post.userId._id || post.userId,
        relatedUser: req.user._id,
        relatedPost: post._id
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Downvote post (decrements votesCount, not below 0)
const downvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.votesCount = Math.max(0, (post.votesCount || 0) - 1);
    await post.save();
    await post.populate('userId');
    await post.populate('communityId');

    // Create notification for post owner (don't notify if downvoting own post)
    // Handle both populated (object) and unpopulated (ObjectId) userId
    const postOwnerId = post.userId._id ? post.userId._id.toString() : post.userId.toString();
    if (postOwnerId !== req.user._id.toString()) {
      const relatedUser = await User.findById(req.user._id).select('username');
      await Notification.create({
        type: 'downvote',
        action: `${relatedUser.username} downvoted your post`,
        user: post.userId._id || post.userId,
        relatedUser: req.user._id,
        relatedPost: post._id
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts by the current user
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id }).populate('userId').populate('communityId');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts by a specific user (by userId)
const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId })
      .populate('userId')
      .populate('communityId')
      .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts in a specific community
const getPostsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const posts = await Post.find({ communityId }).populate('userId').populate('communityId');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search posts by query string (matches title or body)
const searchPosts = async (req, res) => {
  try {
    const q = req.params.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
    const regex = new RegExp(q, 'i');
    const posts = await Post.find({
      $or: [{ title: regex }, { body: regex }]
    })
      .populate('userId')
      .populate('communityId')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMyFeed,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  getPostsByUser,
  getPostsByUserId,
  getPostsByCommunity,
  searchPosts
};

