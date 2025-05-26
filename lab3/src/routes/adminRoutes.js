const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');
const forecastRepository = require('../repositories/forecastRepository');

router.use(isAdmin);

router.get('/', async (req, res) => {
    try {
        const locations = await forecastRepository.getLocations();
        const dates = await forecastRepository.getDates();

        const minDate = dates.reduce((min, date) => date.date < min ? date.date : min, dates[0].date);
        const maxDate = dates.reduce((max, date) => date.date > max ? date.date : max, dates[0].date);

        res.render('admin/index', {
            title: 'Прогноз погоди - Адмін панель',
            username: req.session.user.username,
            locations,
            minDate,
            maxDate,
            success: req.query.success || null
        });
    } catch (error) {
        console.error('Помилка при завантаженні адмін-панелі:', error);
        res.status(500).render('error', {
            title: 'Помилка',
            message: 'Помилка при завантаженні адмін-панелі'
        });
    }
});

router.post('/updateForecast', adminController.updateForecast);
router.post('/createForecast', adminController.createForecast);
router.get('/delete-confirmation', adminController.showDeleteConfirmation);
router.post('/delete', adminController.deleteForecast);
router.get('/cancel', adminController.cancelDelete);

module.exports = router;