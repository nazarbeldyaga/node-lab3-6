const dayService = require('../services/dayService');
const forecastRepository = require('../repositories/forecastRepository');

const createForecast = (req, res) => {
    const newForecast = req.body;
    
    try {
        return dayService.createForecastTransaction(newForecast);
    } catch (error) {
        console.error('Помилка при додаванні погоди:', error);
        res.status(500).render({ message: error.message || 'Не вдалося додати прогноз погоди' });
    }
};

const updateForecast = (req, res) => {
    try {
        const updates = req.body;

        return dayService.updateAllForecastTransaction(updates);
    } catch (error) {
        console.error('Помилка при оновленні погоди:', error);
        res.status(500).json({ message: error.message || 'Не вдалося оновити прогноз погоди' });
    }
};

const deleteForecast = (req, res) => {
    const toDelete = req.body;
    try {
        return dayService.deleteForecastTransaction(toDelete);
    } catch (error) {
        console.error('Помилка при видалити погоди:', error);
        res.status(500).json({ message: error.message || 'Не вдалося видалити прогноз погоди' });
    }
};

// const searchByDay = (req, res) => {
//     const date =  req.body.date;
//     const locationId = parseInt(req.body.location_id);
//
//     try {
//         return dayService.getForecastByDateAndLocation(locationId, date);
//     } catch (error) {
//         console.error('Помилка при отриманні прогнозу:', error);
//         res.status(500).json({ message: 'Помилка при отриманні прогнозу погоди' });
//     }
// };

const searchByDay = async (req, res) => {
    try {
        const { locationId, date } = req.query;

        if (!locationId || !date) {
            return res.status(400).json({ error: 'Необхідно вказати locationId та date' });
        }

        const db = req.app.get('db');
        
        // Спочатку отримуємо об'єкт дати за рядком дати
        const dateObj = await forecastRepository.getDateByDateString(db, date);
        
        if (!dateObj) {
            return res.status(404).json({ error: 'Дату не знайдено' });
        }
        
        // Тепер отримуємо прогнози за locationId та dateId
        const forecasts = await forecastRepository.getForecastsByLocationAndDate(db, parseInt(locationId), dateObj.id);

        res.status(200).json(forecasts);
    } catch (error) {
        console.error('Помилка при отриманні прогнозів:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
};

const getLocations = async (req, res) => {
    try {
        const db = req.app.get('db');
        const locations = await forecastRepository.getLocations(db);
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getLocationById = async (req, res) => {
    try {
        const locationId = parseInt(req.params.id);

        if (isNaN(locationId)) {
            return res.status(400).json({ error: 'Некоректний ID локації' });
        }

        const db = req.app.get('db');
        const location = await forecastRepository.getLocationById(db, locationId);

        if (!location) {
            return res.status(404).json({ error: 'Локацію не знайдено' });
        }

        res.status(200).json(location);
    } catch (error) {
        console.error('Помилка при отриманні локації:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
};

module.exports = {
    createForecast,
    updateForecast,
    deleteForecast,
    getLocations,
    searchByDay,
    getLocationById
};