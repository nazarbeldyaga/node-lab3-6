const dayService = require('../services/dayService');
const forecastRepository = require('../repositories/forecastRepository');

const createForecast = async (req, res) => {
    try {
        const result = await dayService.createForecast(req.body);
        res.redirect('/admin?success=Новий прогноз успішно створено');
    } catch (error) {
        console.error('Помилка при створенні прогнозу:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: `Помилка при створенні прогнозу: ${error.message}` 
        });
    }
};

const updateForecast = async (req, res) => {
    try {
        const result = await dayService.updateForecast(req.body);
        res.redirect('/admin?success=Прогноз успішно оновлено');
    } catch (error) {
        console.error('Помилка при оновленні прогнозу:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: `Помилка при оновленні прогнозу: ${error.message}` 
        });
    }
};

const showDeleteConfirmation = async (req, res) => {
    try {
        const { location_id, date } = req.query;
        const locationId = parseInt(location_id);

        const locations = await forecastRepository.getLocations();
        const location = locations.find(loc => loc.id === locationId);
        
        if (!location) {
            throw new Error('Локацію не знайдено');
        }

        const dates = await forecastRepository.getDates();
        const dateObj = dates.find(d => d.date === date);
        
        if (!dateObj) {
            throw new Error('Дату не знайдено');
        }

        const forecasts = await forecastRepository.getForecasts();
        const forecastsForDateAndLocation = forecasts.filter(
            f => f.location_id === locationId && f.date_id === dateObj.id
        );
        
        res.render('admin/delete-confirmation', {
            title: 'Підтвердження видалення',
            location,
            date: dateObj,
            forecastCount: forecastsForDateAndLocation.length
        });
    } catch (error) {
        console.error('Помилка при підготовці сторінки видалення:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: `Помилка: ${error.message}` 
        });
    }
};

const deleteForecast = async (req, res) => {
    try {
        const { location_id, date } = req.body;
        const locationId = parseInt(location_id);
        
        await dayService.deleteForecastByDateAndLocation(locationId, date);
        res.redirect('/admin?success=Прогноз успішно видалено');
    } catch (error) {
        console.error('Помилка при видаленні прогнозу:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: `Помилка при видаленні прогнозу: ${error.message}` 
        });
    }
};

const cancelDelete = (req, res) => {
    res.redirect('/admin');
};

module.exports = {
    createForecast,
    updateForecast,
    showDeleteConfirmation,
    deleteForecast,
    cancelDelete
};