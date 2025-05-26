const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');

router.use(isAdmin);

router.get('/', (req, res) => {
    res.render('admin/index', {
        title: 'Прогноз погоди - Адмін панель',
        username: req.session.user.username
    });
});

module.exports = router;