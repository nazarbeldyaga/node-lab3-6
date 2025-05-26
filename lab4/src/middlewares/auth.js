const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    res.status(403).render('error', { 
        title: 'Доступ заборонено', 
        message: 'У вас немає прав для доступу до цієї сторінки' 
    });
};

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

module.exports = {
    isAdmin,
    isAuthenticated
};