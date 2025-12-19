const User = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get displayname by user ID
const getDisplayNameById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('displayname');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ displayname: user.displayname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user (for admin or direct creation)
// const createUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
    
//     // Check if user exists
//     const exists = await User.findOne({ $or: [{ email }, { username }] });
//     if (exists) {
//       return res.status(400).json({ error: 'User already exists' });
//     }
    
//     const user = new User({ username, email, password });
//     await user.save();
    
//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.status(201).json(userResponse);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

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

// Update user (current user can only update themselves)
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Don't allow password updates through this endpoint
    if (updates.password) {
      delete updates.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user (current user can only delete themselves)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Signup
const signup = async (req, res) => {
  try {
    const { username, email, password, displayname, avatarUrl, description } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ username, email, password, displayname, avatarUrl, description });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (client-side - just returns success)
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// Join a community
const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const user = await User.findById(req.user._id);
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
    const { communityId } = req.params;

    const user = await User.findById(req.user._id);
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
  getDisplayNameById,
  // createUser,
  updateUser,
  deleteUser,
  searchUsers,
  signup,
  login,
  getCurrentUser,
  logout,
  joinCommunity,
  leaveCommunity
};
  



