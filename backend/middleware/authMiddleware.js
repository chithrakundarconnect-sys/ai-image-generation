const jwt = require('jsonwebtoken');
const User = require('../model/User');

const protect = async (req, res, next) => {
  let token;

  // Debug logging (only in non-production). Avoid printing tokens in production.
  if (process.env.NODE_ENV !== 'production') {
    console.debug('Authorization Header:', req.headers.authorization);
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Extracted Token:', token);
      }

      // Treat literal 'null' or 'undefined' (sent by some clients) as no token
      if (!token || token === 'null' || token === 'undefined') {
        if (process.env.NODE_ENV !== 'production') console.warn('Token missing or invalid (null/undefined)');
        return res.status(401).json({ message: 'Not authorized, no token' });
      }

      // Verify token with secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (process.env.NODE_ENV !== 'production') console.debug('Decoded JWT Payload:', decoded);

      // Find user by decoded ID excluding password field
      req.user = await User.findById(decoded.id).select('-password');

      // If user not found, respond with 401
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Passed all checks — continue to next middleware/route
      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);

      // Handle expired tokens explicitly so the client can react (e.g. refresh or re-login)
      if (error && (error.name === 'TokenExpiredError' || /jwt expired/i.test(error.message))) {
        const expiredAt = error.expiredAt ? error.expiredAt : undefined;
        return res.status(401).json({ message: 'Not authorized, token expired', expiredAt });
      }

      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No token provided
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;