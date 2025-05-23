const express = require('express');
const router = express.Router();
// const bookController = require('../controllers/bookController');
// const authorController = require('../controllers/authorController');
const dayController = require('../controllers/dayController');

router.get('/', (req, res) => {
    res.render('guest/index', { title: 'Прогноз погоди - Календар' }); // Додаємо title
});

router.get('/day', dayController.searchByDay);
// router.get('/search/author', authorController.searchByAuthor);
// router.get('/search/title', bookController.searchByTitle);
// router.get('/search/keyword', bookController.searchByKeyword);

module.exports = router;