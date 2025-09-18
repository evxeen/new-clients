// usage: requireRole('ADMIN') or requireAnyRole('ADMIN','LEAD')
const requireRole = (role) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No user' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
};


const requireAnyRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No user' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
};


module.exports = { requireRole, requireAnyRole };