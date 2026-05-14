const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Нэвтэрч орно уу' });
    try {
        req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'mhq_jwt_secret_2026');
        next();
    } catch {
        res.status(401).json({ error: 'Token хүчингүй байна' });
    }
};
