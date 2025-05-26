const dayService = require('../services/dayService');

// Оновлення погоди
const updateForecast = async (req, res) => {
    try {
        const result = await dayService.updateForecast(req.body);
        res.render('admin/result', {
            title: "Результат",
            result
        });
    } catch (error) {
        console.error('Помилка при оновленні погоди:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: 'Не вдалося оновити прогноз погоди' 
        });
    }
};

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
    updateForecast,
    searchByDay,
    searchByDayCallback,
    searchByDayPromise,
    searchByDaySync
};