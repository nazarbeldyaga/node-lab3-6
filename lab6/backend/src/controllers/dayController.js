const dayService = require('../services/dayService');

const createForecast = async (req, res) => {
    try {
        const newForecast = req.body;

        const result = await dayService.createForecastTransaction(newForecast);
        res.render('admin/result', {
            title: "Результат",
            message: "Прогноз успішно додано ✅",
            result
        });
    } catch (error) {
        console.error('Помилка при додаванні погоди:', error);
        res.status(500).render('error', {
            title: 'Помилка',
            message: error.message || 'Не вдалося додати прогноз погоди'
        });
    }
};

const updateForecast = async (req, res) => {
    try {
        const updates = req.body;

        const result = await dayService.updateAllForecastTransaction(updates);
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

const deleteForecast = async (req, res) => {
    const toDelete = req.body;
    try {
        const result = await dayService.deleteForecastTransaction(toDelete);
        res.render('admin/result', {
            title: "Результат",
            message: "Прогноз успішно видалено ✅",
            result
        });
    } catch (error) {
        console.error('Помилка при видалити погоди:', error);
        res.status(500).render('error', {
            title: 'Помилка',
            message: error.message || 'Не вдалося видалити прогноз погоди'
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
    res.render('calendar/day', {
        title: 'Прогноз погоди',
        searchTerm: `${data.location?.name || 'Локація'} — ${date}`,
        locationName: data.location?.name || 'Невідомо',
        locationId: data.location?.id || null,
        date: data.date?.date || null,
        isWeekend: data.date?.is_weekend,
        forecast: data.forecast || [],
        nextDate: data.nextDateData?.date || null,
        prevDate: data.prevDateData?.date || null
    });
};

module.exports = { 
    createForecast,
    deleteForecast,
    updateForecast,
    searchByDay
};