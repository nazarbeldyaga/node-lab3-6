const Forecast = require('../models/Forecast');
const Location = require('../models/Location');
const DateModel = require('../models/Date');
const { Op, Sequelize } = require('sequelize');

const getLocations = async (t) => {
    return await Location.findAll({ order: [['id', 'ASC']] });
};

const getDates = async (t) => {
    const dates = await DateModel.findAll({ order: [['date', 'ASC']] });
    return dates.map(d => ({
        id: d.id,
        date: d.date,
        is_weekend: d.is_weekend
    }));
};

const getForecasts = async (t) => {
    return await Forecast.findAll({ order: [['location_id', 'ASC'], ['date_id', 'ASC'], ['hour', 'ASC']] });
};

const getForecastsByLocationAndDate = async (t, locationId, dateId) => {
    return await Forecast.findAll({
        where: { location_id: locationId, date_id: dateId },
        order: [['hour', 'ASC']]
    });
};

const getForecastsByLocationAndDateAndHour = async (t, locationId, dateId, hour) => {
    return await Forecast.findAll({
        where: { location_id: locationId, date_id: dateId, hour }
    });
};

const getLocationById = async (t, id) => {
    return await Location.findByPk(id);
};

const getDateByDateString = async (t, dateStr) => {
    const dateObj = await DateModel.findOne({ where: { date: dateStr } });
    return dateObj ? {
        id: dateObj.id,
        date: dateObj.date,
        is_weekend: dateObj.is_weekend
    } : null;
};

const createForecast = async (t, forecast) => {
    const maxId = await Forecast.max('id') || 0;
    forecast.id = maxId + 1;
    return await Forecast.create(forecast);
};

const updateForecastAdmin = async (t, updates) => {
    const [affectedCount] = await Forecast.update(updates, {
        where: {
            location_id: updates.location_id,
            date_id: updates.date_id,
            hour: updates.hour
        }
    });
    return { rowCount: affectedCount };
};

const deleteForecastAdmin = async (t, toDelete) => {
    const deletedCount = await Forecast.destroy({
        where: {
            location_id: toDelete.location_id,
            date_id: toDelete.date_id,
            hour: toDelete.hour
        }
    });
    return { rowCount: deletedCount };
};

module.exports = {
    getLocations,
    getDates,
    getForecasts,
    getForecastsByLocationAndDate,
    getForecastsByLocationAndDateAndHour,
    getLocationById,
    getDateByDateString,
    createForecast,
    updateForecastAdmin,
    deleteForecastAdmin
};
