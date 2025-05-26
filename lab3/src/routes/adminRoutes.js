const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const { isAdmin } = require('../middlewares/auth');
const path = require('path');
const fs = require('fs').promises;

router.use(isAdmin);

router.get('/', async (req, res) => {
    const locations = JSON.parse(await fs.readFile(path.join(__dirname, '../data/locations.json'), 'utf8'));
    const dates = JSON.parse(await fs.readFile(path.join(__dirname, '../data/dates.json'), 'utf8'));

    const dateStrings = dates.map(d => d.date);
    const minDate = dateStrings[0];
    const maxDate = dateStrings[dateStrings.length - 1];   

    res.render('admin/index', {
        title: 'Прогноз погоди - Адмін панель',
        locations,
        minDate,
        maxDate,
        username: req.session.user.username
    });
});

router.post('/updateForecast', dayController.updateForecast);

module.exports = router;