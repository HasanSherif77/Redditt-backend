const Community = require('./communityModel');
const User = require('../users/userModel');

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search communities by query string (matches communityName or communityDescription)
const searchCommunities = async (req, res) => {
  try {
    const q = req.params.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
    const regex = new RegExp(q, 'i');
    const communities = await Community.find({
      $or: [{ communityName: regex }, { communityDescription: regex }]
    });

    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get joined communities for the current user
const getCommunityById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('joinedCommunities');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.joinedCommunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get community info (name and icon) by community ID
const getCommunityInfoById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).select('communityName communityIcon');
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.status(200).json({ 
      communityName: community.communityName,
      communityIcon: community.communityIcon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new community
const createCommunity = async (req, res) => {
  try {
    const community = await Community.create({
      communityName: req.body.communityName,
      communityDescription: req.body.communityDescription,
      communityIcon: req.body.communityIcon || '',
      communityBanner: req.body.communityBanner || ''
    });

    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update community
const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.status(200).json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete community
const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.user._id);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.status(200).json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCommunities,
  getCommunityById,
  getCommunityInfoById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  searchCommunities
};
