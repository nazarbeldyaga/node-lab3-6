const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { isAdmin } = require('../middlewares/auth');

router.get('/', isAdmin, bookController.getAllBooks);
router.get('/create', isAdmin, bookController.createBookForm);
router.post('/create', isAdmin, bookController.createBook);
router.get('/edit/:id', isAdmin, bookController.editBookForm);
router.post('/edit/:id', isAdmin, bookController.updateBook);
router.get('/delete/:id', isAdmin, bookController.confirmDelete);
router.post('/delete/:id', isAdmin, bookController.deleteBook);

module.exports = router;