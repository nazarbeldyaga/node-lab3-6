const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');
const { isAdmin } = require('../middlewares/auth');
const { idValidation, paginationQueryValidation, validationMiddleware } = require('../middlewares/validation/generalValidation');
const { createOrUpdateForecastValidation } = require('../middlewares/validation/DayValidation');

router.get(
    '/',
    [paginationQueryValidation, validationMiddleware],
    async (req, res) => {
        try {
            const { page = 1, limit = 10, locationId, date } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (locationId) where.locationId = parseInt(locationId);
            if (date) where.date = date;

            // Викликаємо метод контролера
            const forecasts = await dayController.searchByDay({ body: { location_id: locationId, date } }, res);
            const total = forecasts.length; // Припускаємо, що total можна отримати з сервісу через контролер

            res.status(200).json({
                data: forecasts,
                pagination: { page: parseInt(page), limit: parseInt(limit), total },
            });
        } catch (error) {
            console.error('Error fetching forecasts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.get(
    '/:id',
    [idValidation, validationMiddleware],
    async (req, res) => {
        try {
            // Викликаємо метод контролера (він поки відсутній, потрібно додати)
            const forecast = await dayController.getForecastById({ params: { id: req.params.id } }, res);
            if (!forecast) return res.status(404).json({ error: 'Forecast not found' });
            res.status(200).json(forecast);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.post(
    '/',
    [isAdmin, createOrUpdateForecastValidation, validationMiddleware],
    async (req, res) => {
        try {
            const forecast = await dayController.createForecast(req, res);
            if (res.headersSent) return; // Якщо контролер уже відправив відповідь
            res.status(201).json(forecast);
        } catch (error) {
            console.error('Error creating forecast:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.patch(
    '/:id',
    [isAdmin, idValidation, createOrUpdateForecastValidation, validationMiddleware],
    async (req, res) => {
        try {
            const forecast = await dayController.updateForecast(req, res);
            if (res.headersSent) return; // Якщо контролер уже відправив відповідь
            if (!forecast) return res.status(404).json({ error: 'Forecast not found' });
            res.status(200).json(forecast);
        } catch (error) {
            console.error('Error updating forecast:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

router.delete(
    '/:id',
    [isAdmin, idValidation, validationMiddleware],
    async (req, res) => {
        try {
            const deleted = await dayController.deleteForecast({ body: { id: req.params.id } }, res);
            if (res.headersSent) return; // Якщо контролер уже відправив відповідь
            if (!deleted) return res.status(404).json({ error: 'Forecast not found' });
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting forecast:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;