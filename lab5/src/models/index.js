const Forecast = require('./Forecast');
const DateModel = require('./Date');
const Location = require('./Location');

Forecast.belongsTo(DateModel, {
    foreignKey: 'date_id',
    as: 'date'
});

Forecast.belongsTo(Location, {
    foreignKey: 'location_id',
    as: 'location'
});

DateModel.hasMany(Forecast, {
    foreignKey: 'date_id',
    as: 'forecasts'
});

Location.hasMany(Forecast, {
    foreignKey: 'location_id',
    as: 'forecasts'
});

module.exports = {
    Forecast,
    DateModel,
    Location
};
