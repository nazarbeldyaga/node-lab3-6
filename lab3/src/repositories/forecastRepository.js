const fs = require('fs').promises;
const fsSync = require('fs'); // Додаємо синхронний fs
const path = require('path');

const locationsPath = path.join(__dirname, '../data/locations.json');
const datesPath = path.join(__dirname, '../data/dates.json');
const forecastsPath = path.join(__dirname, '../data/forecasts.json');

const saveForecast = async (newForecast) => {
    try {
        const forecasts = await getForecasts();

        const existingIndex = forecasts.findIndex(f =>
            f.location_id === newForecast.location_id &&
            f.date_id === newForecast.date_id &&
            f.hour === newForecast.hour
        );

        if (existingIndex !== -1) {
            newForecast.id = forecasts[existingIndex].id;
            forecasts[existingIndex] = newForecast;
        } else {
            const maxId = forecasts.length ? Math.max(...forecasts.map(f => f.id)) : 0;
            newForecast.id = maxId + 1;
            forecasts.push(newForecast);
        }

        await fs.writeFile(forecastsPath, JSON.stringify(forecasts, null, 2), 'utf8');
        return newForecast;

    } catch (error) {
        console.error('Помилка при збереженні прогнозу:', error);
        throw error;
    }
};

// Асинхронні методи з async/await
const getLocations = async () => {
    const data = await fs.readFile(locationsPath, 'utf8');
    return JSON.parse(data);
};

const getDates = async () => {
    const data = await fs.readFile(datesPath, 'utf8');
    return JSON.parse(data);
};

const getForecasts = async () => {
    const data = await fs.readFile(forecastsPath, 'utf8');
    return JSON.parse(data);
};

// Синхронні методи
const getLocationsSync = () => {
    const data = fsSync.readFileSync(locationsPath, 'utf8');
    return JSON.parse(data);
};

const getDatesSync = () => {
    const data = fsSync.readFileSync(datesPath, 'utf8');
    return JSON.parse(data);
};

const getForecastsSync = () => {
    const data = fsSync.readFileSync(forecastsPath, 'utf8');
    return JSON.parse(data);
};

// Методи з використанням класичних Promises
const getLocationsPromise = () => {
    return new Promise((resolve, reject) => {
        fsSync.readFile(locationsPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const locations = JSON.parse(data);
                resolve(locations);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
};

const getDatesPromise = () => {
    return new Promise((resolve, reject) => {
        fsSync.readFile(datesPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const dates = JSON.parse(data);
                resolve(dates);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
};

const getForecastsPromise = () => {
    return new Promise((resolve, reject) => {
        fsSync.readFile(forecastsPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const forecasts = JSON.parse(data);
                resolve(forecasts);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
};

// Методи з використанням callbacks
const getLocationsCallback = (callback) => {
    fsSync.readFile(locationsPath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        try {
            const locations = JSON.parse(data);
            callback(null, locations);
        } catch (parseError) {
            callback(parseError, null);
        }
    });
};

const getDatesCallback = (callback) => {
    fsSync.readFile(datesPath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        try {
            const dates = JSON.parse(data);
            callback(null, dates);
        } catch (parseError) {
            callback(parseError, null);
        }
    });
};

const getForecastsCallback = (callback) => {
    fsSync.readFile(forecastsPath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        try {
            const forecasts = JSON.parse(data);
            callback(null, forecasts);
        } catch (parseError) {
            callback(parseError, null);
        }
    });
};

module.exports = {
    saveForecast,
    getLocations,
    getDates,
    getForecasts,
    getLocationsSync,
    getDatesSync,
    getForecastsSync,
    getLocationsPromise,
    getDatesPromise,
    getForecastsPromise,
    getLocationsCallback,
    getDatesCallback,
    getForecastsCallback
};