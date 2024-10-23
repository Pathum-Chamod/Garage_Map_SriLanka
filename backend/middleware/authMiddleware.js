const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Check if the Authorization header exists and extract the token
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }

  // Handle token with or without 'Bearer ' prefix
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user to the request object
    next(); // Continue to the next middleware
  } catch (error) {
    res.status(401).send('Invalid or expired token.'); // Improved error message
  }
};

module.exports = authenticate;
