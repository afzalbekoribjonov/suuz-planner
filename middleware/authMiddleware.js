const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authenticateToken;
