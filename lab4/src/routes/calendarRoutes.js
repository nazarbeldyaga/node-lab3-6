const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const forecastRepository = require('../repositories/forecastRepository');
const db = require('../config/database');

router.get('/', async (req, res) => {
    const locations = await forecastRepository.getLocations(db);

    res.render('calendar/index', {
        title: 'Прогноз погоди - Календар',
        locations
    });
});

router.get('/day', dayController.searchByDay);

module.exports = router;
