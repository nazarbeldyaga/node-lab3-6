const db = require('../config/database');
const repo = require('../repositories/forecastRepository');

const MAX_TEMPERATURE_CELSIUS = 60  // варто додати окермий файл з константами, чи змінити логіку

// Отримання прогнозу за датою і локацією
const getForecastByDateAndLocation = async (locationId, dateStr) => {
    return db.tx(async t => {
        const location = await repo.getLocationById(t, locationId);
        if (!location) return { location: null, date: null, forecast: [] };

        const date = await repo.getDateByDateString(t, dateStr);
        if (!date) return { location, date: null, forecast: [] };

        const forecast = await repo.getForecastsByLocationAndDate(t, locationId, date.id);
        return { location, date, forecast };
    });
};

// Створення прогнозу
const createForecastTransaction = async (forecast) => {
    return db.tx(async t => {
        if (forecast.temperature > MAX_TEMPERATURE_CELSIUS) {
            throw new Error('The temperature exceeds the permissible limit');
        }

        // Якщо все добре, то створити прогноз
        const created = await repo.createForecast(t, forecast);
        return created;
    });
};

// Оновлення прогнозу
const updateForecastTransaction = async (id, updates) => {
    return db.tx(async t => {
        if (updates.temperature && updates.temperature > MAX_TEMPERATURE_CELSIUS) {
            throw new Error('The temperature exceeds the permissible limit');
        }

        const result = await repo.updateForecast(t, id, updates);
        if (result.rowCount === 0) throw new Error('Forecast not found');
        return true;
    });
};

// Видалення прогнозу
const deleteForecastTransaction = async (id) => {
    return db.tx(async t => {
        const result = await repo.deleteForecast(t, id);
        if (result.rowCount === 0) throw new Error('Forecast not found');
        return true;
    });
};

module.exports = {
    getForecastByDateAndLocation,
    createForecastTransaction,
    updateForecastTransaction,
    deleteForecastTransaction
};