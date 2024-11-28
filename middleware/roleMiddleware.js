const { verifyToken } = require('../utils/token');

const roleMiddleware = (roles) => (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = verifyToken(token);
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = roleMiddleware;
