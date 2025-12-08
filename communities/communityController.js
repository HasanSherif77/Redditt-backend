const Community = require('./communityModel');

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('creator')
      .populate('members');
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get community by ID
const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creator')
      .populate('members');
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.status(200).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new community
const createCommunity = async (req, res) => {
  try {
    const community = new Community(req.body);
    await community.save();
    await community.populate('creator');
    await community.populate('members');
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update community
const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('creator').populate('members');
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
    const community = await Community.findByIdAndDelete(req.params.id);
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
  createCommunity,
  updateCommunity,
  deleteCommunity
};

