const express = require('express');
const router = express.Router();
const {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity
} = require('./communityController');

// GET /api/communities - Get all communities
router.get('/', getAllCommunities);

// GET /api/communities/:id - Get community by ID
router.get('/:id', getCommunityById);

// POST /api/communities - Create new community
router.post('/', createCommunity);

// PATCH /api/communities/:id - Update community
router.patch('/:id', updateCommunity);

// DELETE /api/communities/:id - Delete community
router.delete('/:id', deleteCommunity);

module.exports = router;

