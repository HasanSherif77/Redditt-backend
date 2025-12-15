const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  getCurrentUser,
  logout
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

// Get all users (protected)
router.get('/', authenticateToken, getAllUsers);

// Get user by ID (protected)
router.get('/:id', authenticateToken, getUserById);

// Create new user (admin only or public signup via /signup)
// This endpoint could be removed since we have /signup
router.post('/', createUser);

// Update user (user can only update themselves)
router.put('/:id', authenticateToken, authorizeUser(), updateUser);

// Delete user (user can only delete themselves)
router.delete('/:id', authenticateToken, authorizeUser(), deleteUser);

module.exports = router;