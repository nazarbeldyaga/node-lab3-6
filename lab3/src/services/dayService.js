const fs = require('fs').promises;
const path = require('path');

const getForecastByDateAndLocation = async (locationId, dateStr) => {
    const locations = JSON.parse(await fs.readFile(path.join(__dirname, '../data/locations.json'), 'utf8'));
    const dates = JSON.parse(await fs.readFile(path.join(__dirname, '../data/dates.json'), 'utf8'));
    const forecasts = JSON.parse(await fs.readFile(path.join(__dirname, '../data/forecasts.json'), 'utf8'));

    const location = locations.find(loc => loc.id === locationId);
    const date = dates.find(d => d.date === dateStr);

    if (!date) return { location, date: null, forecast: [] };

    const forecast = forecasts.filter(f => f.location_id === locationId && f.date_id === date.id);

    return { location, date, forecast };
};

module.exports = { getForecastByDateAndLocation };
