const jwt = require('jsonwebtoken');

const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

/**
 * Middleware to authenticate users by verifying their JWT token.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    // Attach user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
