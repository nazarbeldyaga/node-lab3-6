const forecastRepository = require('../repositories/forecastRepository');

const updateForecast = async (weatherData) => {
    const dates = await forecastRepository.getDates();
    const dateObj = dates.find(d => d.date === weatherData.date);
    const date_id = dateObj ? dateObj.id : null;

    if (!date_id) throw new Error('Невірна дата: не знайдено date_id');

    const hour = parseInt(weatherData.time.split(':')[0], 10);
    
    const date = dateObj ? dateObj.date : null;
    const locations = await repo.getLocations(t);
    const location_name = locations.find(loc => loc.id === Number(weatherData.location_id)).name;

    const forecast = {
        location_id: Number(weatherData.location_id),
        date_id,
        location_name: location_name,
        date,
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

    return await forecastRepository.saveForecast(forecast);
};

const createForecast = async (weatherData) => {
    const dates = await forecastRepository.getDates();

    const dateExists = dates.some(d => d.date === weatherData.date);
    
    if (dateExists) {
        throw new Error('Дата вже існує. Для оновлення використовуйте функцію оновлення.');
    }

    const newDateId = dates.length > 0 ? Math.max(...dates.map(d => d.id)) + 1 : 1;
    const newDate = {
        id: newDateId,
        date: weatherData.date
    };

    await forecastRepository.saveDate(newDate);

    const hour = parseInt(weatherData.time.split(':')[0], 10);
    
    const date = dateObj ? dateObj.date : null;
    const locations = await repo.getLocations(t);
    const location_name = locations.find(loc => loc.id === Number(weatherData.location_id)).name;
    
    const forecast = {
        location_id: Number(weatherData.location_id),
        date_id: newDateId,
        location_name: location_name,
        date,
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
    return { date: newDate, forecast: savedForecast };
};

const deleteForecastByDateAndLocation = async (locationId, dateStr) => {
    const dates = await forecastRepository.getDates();
    const forecasts = await forecastRepository.getForecasts();

    const dateObj = dates.find(d => d.date === dateStr);
    
    if (!dateObj) {
        throw new Error('Дата не знайдена');
    }

    const forecastsToDelete = forecasts.filter(
        f => f.location_id === locationId && f.date_id === dateObj.id
    );
    
    if (forecastsToDelete.length === 0) {
        throw new Error('Прогнози для цієї дати та локації не знайдено');
    }

    for (const forecast of forecastsToDelete) {
        await forecastRepository.deleteForecast(forecast.id);
    }
    
    return { deletedCount: forecastsToDelete.length };
};

const getForecastByDateAndLocation = async (locationId, dateStr) => {
    const locations = await forecastRepository.getLocations();
    const dates = await forecastRepository.getDates();
    const forecasts = await forecastRepository.getForecasts();

    const location = locations.find(loc => loc.id === locationId);
    const date = dates.find(d => d.date === dateStr);

    if (!date) return { location, date: null, forecast: [] };
    
    nextDate = new Date(dateStr).getTime() + 1 * 24 * 60 * 60 * 1000;
    nextDateData = dates.find(d => d.date === new Date(nextDate).toISOString().split('T')[0]);

    prevDate = new Date(dateStr).getTime() - 1 * 24 * 60 * 60 * 1000;
    prevDateData = dates.find(d => d.date === new Date(prevDate).toISOString().split('T')[0]);

    const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

    return { location, date, forecast, nextDateData, prevDateData };
};

// Метод з використанням синхронних функцій
const getForecastByDateAndLocationSync = (locationId, dateStr) => {
    const locations = forecastRepository.getLocationsSync();
    const dates = forecastRepository.getDatesSync();
    const forecasts = forecastRepository.getForecastsSync();

    const location = locations.find(loc => loc.id === locationId);
    const date = dates.find(d => d.date === dateStr);

    if (!date) return { location, date: null, forecast: [] };
    
    nextDate = new Date(dateStr).getTime() + 1 * 24 * 60 * 60 * 1000;
    nextDateData = dates.find(d => d.date === new Date(nextDate).toISOString().split('T')[0]);

    prevDate = new Date(dateStr).getTime() - 1 * 24 * 60 * 60 * 1000;
    prevDateData = dates.find(d => d.date === new Date(prevDate).toISOString().split('T')[0]);

    const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

    return { location, date, forecast, nextDateData, prevDateData };
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
    
        nextDate = new Date(dateStr).getTime() + 1 * 24 * 60 * 60 * 1000;
        nextDateData = dates.find(d => d.date === new Date(nextDate).toISOString().split('T')[0]);

        prevDate = new Date(dateStr).getTime() - 1 * 24 * 60 * 60 * 1000;
        prevDateData = dates.find(d => d.date === new Date(prevDate).toISOString().split('T')[0]);

        const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

        return { location, date, forecast, nextDateData, prevDateData };
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
                callback(null, { location: locationData, date: null, forecast: [], nextDateData: null, prevDateData: null });
                return;
            }

            nextDate = new Date(dateStr).getTime() + 1 * 24 * 60 * 60 * 1000;
            nextDateData = dates.find(d => d.date === new Date(nextDate).toISOString().split('T')[0]);

            prevDate = new Date(dateStr).getTime() - 1 * 24 * 60 * 60 * 1000;
            prevDateData = dates.find(d => d.date === new Date(prevDate).toISOString().split('T')[0]);

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
                    forecast: forecastData,
                    nextDateData: nextDateData,
                    prevDateData: prevDateData
                });
            });
        });
    });
};

module.exports = { 
    updateForecast,
    createForecast,
    deleteForecastByDateAndLocation,
    getForecastByDateAndLocation,
    getForecastByDateAndLocationSync,
    getForecastByDateAndLocationPromise,
    getForecastByDateAndLocationCallback
};