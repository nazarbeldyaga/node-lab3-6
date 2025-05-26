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

module.exports = { 
    getForecastByDateAndLocation
};