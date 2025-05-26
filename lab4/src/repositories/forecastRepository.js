const fs = require('fs').promises;
const path = require('path');

const locationsPath = path.join(__dirname, '../data/locations.json');
const datesPath = path.join(__dirname, '../data/dates.json');
const forecastsPath = path.join(__dirname, '../data/forecasts.json');

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

module.exports = {
    getLocations,
    getDates,
    getForecasts
};