const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', (req, res) => {
    res.render('guest/index', { title: 'Прогноз погоди - Календар' });
});

router.get('/day', dayController.searchByDay);
module.exports = router;