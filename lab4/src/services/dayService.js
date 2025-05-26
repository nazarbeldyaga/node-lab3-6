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

// Оновлення прогнозу для адміністратора
const updateAllForecastTransaction = async (id, weatherData) => {
    return db.tx(async t => {
        const dates = await repo.getDates(t);
        const dateObj = dates.find(d => d.date === weatherData.date);
        const date_id = dateObj ? dateObj.id : null;
        if (!date_id) throw new Error('Invalid date: не знайдено date_id');

        const hour = parseInt(weatherData.time.split(':')[0], 10);

        const updates = {
            location_id: Number(weatherData.location_id),
            date_id,
            hour,
            temperature: Number(weatherData.temperature),
            wind_direction: weatherData.wind_direction,
            wind_speed: Number(weatherData.wind_speed),
            precipitation: Number(weatherData.precipitation),
            cloud_type: weatherData.cloud_type,
            is_rain: weatherData.is_rain === 'on',
            is_thunderstorm: weatherData.is_thunderstorm === 'on',
            is_snow: weatherData.is_snow === 'on',
            is_hail: weatherData.is_hail === 'on',
        };

        const result = await repo.updateAllForecast(t, id, updates);
        if (result.rowCount === 0) throw new Error('Прогноз не знайдено');

        return { success: true, id, updated: updates };
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
    updateAllForecastTransaction,
    deleteForecastTransaction
};