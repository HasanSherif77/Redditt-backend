const Community = require('./communityModel');

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get community by ID
const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.user._id);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get community name by community ID
const getCommunityNameById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).select('communityName');
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.status(200).json({ communityName: community.communityName });
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
  getCommunityNameById,
  createCommunity,
  updateCommunity,
  deleteCommunity
};
