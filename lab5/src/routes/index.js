const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Прогноз погоди - Головна' });
});

module.exports = router;