const isAdmin = (req, res, next) => {
    req.user = { role: 'admin' }; // Заглушка: завжди адмін
    if (req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied');
};

module.exports = { isAdmin };