const express = require('express');
const router = express.Router();
const forecastRepository = require('../repositories/forecastRepository');

router.get('/', async (req, res) => {
    try {
        const db = req.app.get('db');
        const locations = await forecastRepository.getLocations(db);
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;