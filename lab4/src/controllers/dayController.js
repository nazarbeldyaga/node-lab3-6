const dayService = require('../services/dayService');

const updateForecast = async (req, res) => {
    try {
        const forecastId = parseInt(req.params.id);
        const updates = req.body;

        const result = await dayService.updateAllForecastTransaction(forecastId, updates);
        console.log(result)
        res.render('admin/result', {
            title: "Результат",
            message: "Прогноз успішно оновлено ✅",
            result
        });
    } catch (error) {
        console.error('Помилка при оновленні погоди:', error);
        res.status(500).render('error', {
            title: 'Помилка',
            message: error.message || 'Не вдалося оновити прогноз погоди'
        });
    }
};

const searchByDay = async (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    try {
        const data = await dayService.getForecastByDateAndLocation(locationId, date);
        renderForecastPage(res, data, date);
    } catch (error) {
        console.error('Помилка при отриманні прогнозу:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: 'Помилка при отриманні прогнозу погоди' 
        });
    }
};

// Рендер
const renderForecastPage = (res, data, date) => {
    res.render('guest/day', {
        title: 'Прогноз погоди',
        searchTerm: `${data.location?.name || 'Локація'} — ${date}`,
        locationName: data.location?.name || 'Невідомо',
        date: data.date?.date || null,
        isWeekend: data.date?.is_weekend,
        forecast: data.forecast || []
    });
};

module.exports = { 
    updateForecast,
    searchByDay
};