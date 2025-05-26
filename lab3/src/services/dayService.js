const forecastRepository = require('../repositories/forecastRepository');

// Метод з використанням async/await
const getForecastByDateAndLocation = async (locationId, dateStr) => {
    const locations = await forecastRepository.getLocations();
    const dates = await forecastRepository.getDates();
    const forecasts = await forecastRepository.getForecasts();

    const location = locations.find(loc => loc.id === locationId);
    const date = dates.find(d => d.date === dateStr);

    if (!date) return { location, date: null, forecast: [] };

    const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

    return { location, date, forecast };
};

// Метод з використанням синхронних функцій
const getForecastByDateAndLocationSync = (locationId, dateStr) => {
    const locations = forecastRepository.getLocationsSync();
    const dates = forecastRepository.getDatesSync();
    const forecasts = forecastRepository.getForecastsSync();

    const location = locations.find(loc => loc.id === locationId);
    const date = dates.find(d => d.date === dateStr);

    if (!date) return { location, date: null, forecast: [] };

    const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

    return { location, date, forecast };
};

// Метод з використанням класичних Promises
const getForecastByDateAndLocationPromise = (locationId, dateStr) => {
    return Promise.all([
        forecastRepository.getLocationsPromise(),
        forecastRepository.getDatesPromise(),
        forecastRepository.getForecastsPromise()
    ])
    .then(([locations, dates, forecasts]) => {
        const location = locations.find(loc => loc.id === locationId);
        const date = dates.find(d => d.date === dateStr);

        if (!date) return { location, date: null, forecast: [] };

        const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

        return { location, date, forecast };
    })
    .catch(error => {
        console.error('Помилка при отриманні прогнозу:', error);
        throw error;
    });
};

// Метод з використанням callbacks
const getForecastByDateAndLocationCallback = (locationId, dateStr, callback) => {
    let locationData = null;
    let dateData = null;
    let forecastData = null;
    let errorOccurred = false;

    // Отримуємо локації
    forecastRepository.getLocationsCallback((err, locations) => {
        if (err || errorOccurred) {
            if (!errorOccurred) {
                errorOccurred = true;
                callback(err, null);
            }
            return;
        }

        locationData = locations.find(loc => loc.id === locationId);

        // Отримуємо дати
        forecastRepository.getDatesCallback((err, dates) => {
            if (err || errorOccurred) {
                if (!errorOccurred) {
                    errorOccurred = true;
                    callback(err, null);
                }
                return;
            }

            dateData = dates.find(d => d.date === dateStr);

            if (!dateData) {
                callback(null, { location: locationData, date: null, forecast: [] });
                return;
            }

            // Отримуємо прогнози
            forecastRepository.getForecastsCallback((err, forecasts) => {
                if (err || errorOccurred) {
                    if (!errorOccurred) {
                        errorOccurred = true;
                        callback(err, null);
                    }
                    return;
                }

                forecastData = forecasts.filter(f => f.location_id === locationId && f.date_id === dateData.id);

                callback(null, { 
                    location: locationData, 
                    date: dateData, 
                    forecast: forecastData 
                });
            });
        });
    });
};

module.exports = { 
    getForecastByDateAndLocation,
    getForecastByDateAndLocationSync,
    getForecastByDateAndLocationPromise,
    getForecastByDateAndLocationCallback
};