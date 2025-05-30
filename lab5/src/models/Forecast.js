const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Forecast = sequelize.define('Forecast', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    location_id: DataTypes.INTEGER,
    date_id: DataTypes.INTEGER,
    hour: DataTypes.INTEGER,
    temperature: DataTypes.INTEGER,
    cloud_type: DataTypes.ENUM('сонячно', 'частково хмарно', 'хмарно'),
    wind_direction: DataTypes.ENUM('Зх', 'Сх', 'Пн', 'Пд', 'ПнЗх', 'ПнСх', 'ПдЗх', 'ПдСх'),
    wind_speed: DataTypes.INTEGER,
    precipitation: DataTypes.FLOAT,
    is_rain: DataTypes.BOOLEAN,
    is_thunderstorm: DataTypes.BOOLEAN,
    is_snow: DataTypes.BOOLEAN,
    is_hail: DataTypes.BOOLEAN
}, {
    tableName: 'forecasts',
    timestamps: false
});

module.exports = Forecast;
