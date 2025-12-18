const User = require('./userModel');


//for auth => 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('joinedCommunities');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search users by query string (matches username, displayname or email)
const searchUsers = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ username: regex }, { displayname: regex }, { email: regex }]
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// added signup and login logic 
const signup = async (req, res,next) => {
  try {
    const { username, email, password, displayname, avatarUrl, description } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ username, email, password, displayname, avatarUrl, description });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
   next(error);
  }
};

// Join a community
const joinCommunity = async (req, res) => {
  try {
    const { userId, communityId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already in the community
    if (user.joinedCommunities.includes(communityId)) {
      return res.status(400).json({ error: 'User is already a member of this community' });
    }

    // Add community to user's joined communities
    user.joinedCommunities.push(communityId);
    await user.save();

    await user.populate('joinedCommunities');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Leave a community
const leaveCommunity = async (req, res) => {
  try {
    const { userId, communityId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is in the community
    if (!user.joinedCommunities.includes(communityId)) {
      return res.status(400).json({ error: 'User is not a member of this community' });
    }

    // Remove community from user's joined communities
    user.joinedCommunities = user.joinedCommunities.filter(
      id => id.toString() !== communityId
    );
    await user.save();

    await user.populate('joinedCommunities');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  signup,
  login,
  joinCommunity,
  leaveCommunity
};


