const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const jwt_secret_key = process.env.JWT_KEY;
const ADMIN = process.env.ADMIN;

const isAdmin = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found.' });
    }

    try {
        const decoded = jwt.verify(token, jwt_secret_key);

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        if (ADMIN === decoded.email || user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'teacher') {
            req.email = decoded.email;
            next();
        } else {
            return res.status(403).json({ message: 'Permission denied. Admin or teacher access required.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { isAdmin };
