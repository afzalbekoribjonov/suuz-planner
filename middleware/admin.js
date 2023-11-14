const jwt = require('jsonwebtoken');

const ADMIN = "burxon@ug.shardauniversity.uz";

const isAdmin = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found.' });
    }

    try {
        const decoded = jwt.verify(token, "your-secret-key");
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