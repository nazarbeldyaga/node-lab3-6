const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const forecastRepository = require('../repositories/forecastRepository');
const { isAdmin } = require('../middlewares/auth');
const db = require('../config/database');

router.use(isAdmin);

router.get('/', async (req, res) => {
    const locations = await forecastRepository.getLocations(db);

    res.render('admin/index', {
        title: 'Прогноз погоди - Адмін панель',
        locations,
        username: req.session.user.username
    });
});

router.post('/createForecast', dayController.createForecast);

router.post('/updateForecast', dayController.updateForecast);

router.post('/deleteForecast', dayController.deleteForecast);

module.exports = router;