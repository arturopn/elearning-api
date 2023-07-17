// middlewares/auth.js
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  console.log('Token:', token); // Check if the token is present

  if (!token) {
    console.log('Access denied: Token is missing');
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
   // console.log('Decoded user:', decoded); // Check the decoded user object
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorizeUser = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeUser };
