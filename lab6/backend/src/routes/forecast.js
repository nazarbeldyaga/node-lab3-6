const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const dayService = require('../services/dayService');

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, locationId, date } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (locationId) where.locationId = parseInt(locationId);
        if (date) where.date = date;

        const db = req.app.get('db');
        const forecasts = await dayService.getForecasts(db, { where, limit: parseInt(limit), offset });
        const total = await dayService.countForecasts(db, where);

        res.status(200).json({
            data: forecasts,
            pagination: { page: parseInt(page), limit: parseInt(limit), total },
        });
    } catch (error) {
        console.error('Error fetching forecasts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = req.app.get('db');
        const forecast = await dayService.getForecastById(db, req.params.id);
        if (!forecast) return res.status(404).json({ error: 'Forecast not found' });
        res.status(200).json(forecast);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', isAdmin, async (req, res) => {
    try {
        const { locationId, date, temperature, description } = req.body;
        if (!locationId || !date || !temperature || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const db = req.app.get('db');
        const forecast = await dayService.createForecast(db, req.body);
        res.status(201).json(forecast);
    } catch (error) {
        console.error('Error creating forecast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id', isAdmin, async (req, res) => {
    try {
        const db = req.app.get('db');
        const forecast = await dayService.updateForecast(db, req.params.id, req.body);
        if (!forecast) return res.status(404).json({ error: 'Forecast not found' });
        res.status(200).json(forecast);
    } catch (error) {
        console.error('Error updating forecast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const db = req.app.get('db');
        const deleted = await dayService.deleteForecast(db, req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Forecast not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting forecast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;