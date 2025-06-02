const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { validationMiddleware } = require('../middlewares/validation/validationMiddleware');

router.get(
    '/',
    [validationMiddleware], // Наразі валідація не потрібна, але залишаємо middleware
    async (req, res) => {
        try {
            const locations = await locationController.getLocations(req, res);
            if (res.headersSent) return; // Якщо контролер уже відправив відповідь
            res.status(200).json(locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;