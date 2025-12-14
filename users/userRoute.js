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
  login
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

module.exports = router;

