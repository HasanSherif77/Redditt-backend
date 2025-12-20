const express = require('express');
const router = express.Router();
const {
  getAllCommunities,
  getCommunityById,
  getCommunityInfoById,
  createCommunity,
  updateCommunity,
  deleteCommunity
} = require('./communityController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/communities - Get all communities
router.get('/', authenticateToken, getAllCommunities);

// GET /api/communities/name/:id - Get community name by community ID
router.get('/info/:id', authenticateToken, getCommunityInfoById);

// GET /api/communities/:id - Get community by ID
router.get('/me', authenticateToken, getCommunityById);

// POST /api/communities - Create new community
router.post('/', authenticateToken, createCommunity);

// PATCH /api/communities/:id - Update community
router.patch('/', authenticateToken, updateCommunity);

// DELETE /api/communities/:id - Delete community
router.delete('/', authenticateToken, deleteCommunity);

module.exports = router;

