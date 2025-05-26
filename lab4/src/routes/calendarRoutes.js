const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const forecastRepository = require('../repositories/forecastRepository');
const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

router.get('/', async (req, res) => {
    const locations = await forecastRepository.getLocations(db);
    const dates = await forecastRepository.getDates(db);

    const dateStrings = dates.map(d => d.date);
    const minDate = dateStrings[0];
    const maxDate = dateStrings[dateStrings.length - 1];

    res.render('calendar/index', {
        title: 'Прогноз погоди - Календар',
        locations,
        minDate,
        maxDate
    });
});

router.get('/day', dayController.searchByDay);

module.exports = router;
