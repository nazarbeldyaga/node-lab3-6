const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', dayController.getLocations);
router.get('/:id', dayController.getLocationById);

module.exports = router;