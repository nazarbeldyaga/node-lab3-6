const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', dayController.searchByDay);
router.post('/forecast', dayController.createForecast);
router.put('/forecast', dayController.updateForecast);
router.delete('/forecast', dayController.deleteForecast);

module.exports = router;
