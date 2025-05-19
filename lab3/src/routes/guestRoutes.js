const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');

router.get('/', (req, res) => {
    res.render('guest/index', { title: 'Guest - Library Catalog' }); // Додаємо title
});

router.get('/search/author', authorController.searchByAuthor);
router.get('/search/title', bookController.searchByTitle);
router.get('/search/keyword', bookController.searchByKeyword);

module.exports = router;