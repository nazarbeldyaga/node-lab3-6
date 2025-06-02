const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', async (req, res) => {
    const locations = getLocations();

    res.render('calendar/index', {
        title: 'Прогноз погоди - Календар',
        locations
    });
});

router.get('/day', dayController.searchByDay);

module.exports = router;