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

const searchByDay = (req, res) => {
    const date =  req.body.date;
    const locationId = parseInt(req.body.location_id);

    try {
        return dayService.getForecastByDateAndLocation(locationId, date);
    } catch (error) {
        console.error('Помилка при отриманні прогнозу:', error);
        res.status(500).json({ message: 'Помилка при отриманні прогнозу погоди' });
    }
};

const getLocations = (req, res) => {
    console.log("SKGHJKSHGJKS")
    try {
        const db = req.app.get('db');
        const locations = forecastRepository.getLocations(db);
        return locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createForecast,
    deleteForecast,
    updateForecast,
    searchByDay,
    getLocations
};