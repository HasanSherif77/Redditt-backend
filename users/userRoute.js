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
  joinCommunity,
  leaveCommunity
} = require('./userController');

//added paths for auth: 
/* AUTH */
router.post('/signup', signup);
router.post('/login', login);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/search?q=... - Search users by letters
router.get('/search', searchUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', createUser);

// PATCH /api/users/:id - Update user
router.patch('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

// POST /api/users/:userId/communities/:communityId/join - Join a community
router.post('/:userId/communities/:communityId/join', joinCommunity);

// POST /api/users/:userId/communities/:communityId/leave - Leave a community
router.post('/:userId/communities/:communityId/leave', leaveCommunity);

module.exports = router;

