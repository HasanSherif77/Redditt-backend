const express = require('express');
const router = express.Router();
const {
   getUserById,
   getUserInfoById,
   searchUsers,
   // createUser,
   updateUser,
   deleteUser,
   signup,
   login,
   getCurrentUser,
   logout,
   joinCommunity,
   leaveCommunity,
   getAllUsers,
} = require('./userController');

const { authenticateToken } = require('../middleware/authMiddleware');

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
router.get('/search', authenticateToken, searchUsers);


// Get all users (protected)
router.get('/', authenticateToken, getAllUsers);

// GET /api/users/username/:id - Get username by user ID
router.get('/info/:id', authenticateToken, getUserInfoById);

// Get user by ID (protected)
router.get('/:id', authenticateToken, getUserById);


// PATCH /api/users/me - Update current user
router.patch('/me', authenticateToken, updateUser);

// DELETE /api/users/me - Delete current user
router.delete('/me', authenticateToken, deleteUser);

// POST /api/users/communities/:communityId/join - Join a community
router.post('/communities/:communityId/join', authenticateToken, joinCommunity);

// POST /api/users/communities/:communityId/leave - Leave a community
router.post('/communities/:communityId/leave', authenticateToken, leaveCommunity);

module.exports = router;