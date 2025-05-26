const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const forecastRepository = require('../repositories/forecastRepository');
const { isAdmin } = require('../middlewares/auth');
const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

router.use(isAdmin);

router.get('/', async (req, res) => {
    const locations = await forecastRepository.getLocations(db);
    const dates = await forecastRepository.getDates(db);

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