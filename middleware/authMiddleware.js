const jwt = require('jsonwebtoken');
const User = require('../users/userModel');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Middleware to check if user owns the resource
const authorizeUser = (resourceField = '_id') => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    
    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID not provided' });
    }

    // Check if user is the owner
    if (req.user._id.toString() !== resourceId.toString()) {
      return res.status(403).json({ 
        error: 'Forbidden. You are not authorized to access this resource.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateToken,
  authorizeUser
};