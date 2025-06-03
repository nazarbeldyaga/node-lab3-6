const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', dayController.searchByDay);
router.post('/', dayController.createForecast);
router.put('/', dayController.updateForecast);
router.delete('/', dayController.deleteForecast);

module.exports = router;