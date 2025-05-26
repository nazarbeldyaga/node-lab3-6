const dayService = require('../services/dayService');

// Версія з async/await
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

// Версія з колбеками
const searchByDayCallback = (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    dayService.getForecastByDateAndLocationCallback(locationId, date, (err, data) => {
        if (err) {
            console.error('Помилка при отриманні прогнозу:', err);
            return res.status(500).render('error', { 
                title: 'Помилка', 
                message: 'Помилка при отриманні прогнозу погоди' 
            });
        }
        renderForecastPage(res, data, date);
    });
};

// Версія з Promise
const searchByDayPromise = (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    dayService.getForecastByDateAndLocationPromise(locationId, date)
        .then(data => {
            renderForecastPage(res, data, date);
        })
        .catch(error => {
            console.error('Помилка при отриманні прогнозу:', error);
            res.status(500).render('error', { 
                title: 'Помилка', 
                message: 'Помилка при отриманні прогнозу погоди' 
            });
        });
};

// Версія з синхронними викликами
const searchByDaySync = (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    try {
        const data = dayService.getForecastByDateAndLocationSync(locationId, date);
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
    searchByDay,
    searchByDayCallback,
    searchByDayPromise,
    searchByDaySync
};