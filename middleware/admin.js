const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwt_secret_key = process.env.JWT_KEY;
const ADMIN = process.env.ADMIN;

const isAdmin = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found.' });
    }

    try {
        const decoded = jwt.verify(token, jwt_secret_key);
        if (decoded.email === ADMIN) {
            req.email = decoded.email;
            next();
        } else {
            return res.status(403).json({ message: 'Permission denied. Admin access required.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { isAdmin };