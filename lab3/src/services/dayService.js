const forecastRepository = require('../repositories/forecastRepository');

const updateForecast = async (weatherData) => {
    const dates = await forecastRepository.getDates();
    const dateObj = dates.find(d => d.date === weatherData.date);
    const date_id = dateObj ? dateObj.id : null;

    if (!date_id) throw new Error('Invalid date: не знайдено date_id');

    const hour = parseInt(weatherData.time.split(':')[0], 10);

    const forecast = {
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

    const savedForecast = await forecastRepository.saveForecast(forecast);
    return savedForecast;
};

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
    updateForecast,
    getForecastByDateAndLocation,
    getForecastByDateAndLocationSync,
    getForecastByDateAndLocationPromise,
    getForecastByDateAndLocationCallback
};