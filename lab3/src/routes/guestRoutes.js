const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const path = require('path');
const fs = require('fs').promises;

router.get('/', async (req, res) => {
    const locations = JSON.parse(await fs.readFile(path.join(__dirname, '../data/locations.json'), 'utf8'));
    const dates = JSON.parse(await fs.readFile(path.join(__dirname, '../data/dates.json'), 'utf8'));

    const dateStrings = dates.map(d => d.date);
    const minDate = dateStrings[0];
    const maxDate = dateStrings[dateStrings.length - 1];

    res.render('guest/index', {
        title: 'Прогноз погоди - Календар',
        locations,
        minDate,
        maxDate
    });
});

router.get('/day', dayController.searchByDay);

//     searchByDay,
//     searchByDayCallback,
//     searchByDayPromise,
//     searchByDaySync

module.exports = router;
