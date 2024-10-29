const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Check if the Authorization header exists and extract the token
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Handle token with or without 'Bearer ' prefix
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user to the request object
    next(); // Continue to the next middleware
  } catch (error) {
    // Use more specific error messages in development if needed
    const errorMessage = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: errorMessage });
  }
};

module.exports = authenticate;
