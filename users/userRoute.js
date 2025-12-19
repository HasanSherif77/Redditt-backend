const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  getCurrentUser,
  logout
  joinCommunity,
  leaveCommunity
} = require('./userController');

const { authenticateToken, authorizeUser } = require('../middleware/authMiddleware');

/* =====================
   PUBLIC ROUTES
===================== */
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

/* =====================
   PROTECTED ROUTES
===================== */

// Get current user profile
router.get('/me', authenticateToken, getCurrentUser);
// GET /api/users/search?q=... - Search users by letters
router.get('/search', searchUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// Get all users (protected)
router.get('/', authenticateToken, getAllUsers);

// Get user by ID (protected)
router.get('/:id', authenticateToken, getUserById);

// Create new user (admin only or public signup via /signup)
// This endpoint could be removed since we have /signup
router.post('/', createUser);
// PATCH /api/users/:id - Update user
router.patch('/:id', updateUser);

// Update user (user can only update themselves)
router.put('/:id', authenticateToken, authorizeUser(), updateUser);

// Delete user (user can only delete themselves)
router.delete('/:id', authenticateToken, authorizeUser(), deleteUser);
// POST /api/users/:userId/communities/:communityId/join - Join a community
router.post('/:userId/communities/:communityId/join', joinCommunity);

// POST /api/users/:userId/communities/:communityId/leave - Leave a community
router.post('/:userId/communities/:communityId/leave', leaveCommunity);

module.exports = router;

module.exports = router;