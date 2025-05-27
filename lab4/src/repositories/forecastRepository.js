const getLocations = (db) =>
    db.any('SELECT * FROM locations ORDER BY id');

const getDates = (db) =>
    db.any("SELECT id, to_char(date, 'YYYY-MM-DD') as date, is_weekend FROM dates ORDER BY date");

const getForecasts = (db) =>
    db.any(`
        SELECT 
            f.id, f.location_id, f.date_id, f.hour, f.temperature, 
            f.cloud_type::text, f.wind_direction::text, f.wind_speed
        FROM forecasts f
        ORDER BY f.location_id, f.date_id, f.hour
    `);

const getForecastsByLocationAndDate = (db, locationId, dateId) =>
    db.any(`
        SELECT 
            f.id, f.location_id, f.date_id, f.hour, f.temperature,
            f.cloud_type::text, f.wind_direction::text, f.wind_speed,
            f.precipitation, f.is_rain, f.is_thunderstorm, f.is_snow, f.is_hail
        FROM forecasts f
        WHERE f.location_id = $1 AND f.date_id = $2
        ORDER BY f.hour
    `, [locationId, dateId]);

const getForecastsByLocationAndDateAndHour = (db, locationId, dateId, hour) =>
    db.any(`
        SELECT 
            f.id, f.location_id, f.date_id, f.hour, f.temperature,
            f.cloud_type::text, f.wind_direction::text, f.wind_speed,
            f.precipitation, f.is_rain, f.is_thunderstorm, f.is_snow, f.is_hail
        FROM forecasts f
        WHERE f.location_id = $1 AND f.date_id = $2 AND f.hour = $3
    `, [locationId, dateId, hour]);

const getLocationById = (db, id) =>
    db.oneOrNone('SELECT * FROM locations WHERE id = $1', [id]);

const getDateByDateString = (db, dateStr) =>
    db.oneOrNone("SELECT id, to_char(date, 'YYYY-MM-DD') as date, is_weekend FROM dates WHERE date = $1::date", [dateStr]);

// CRUD для forecasts
const createForecast = async (t, forecast) => {
    const maxIdResult = await t.oneOrNone('SELECT MAX(id) FROM forecasts');
    const newId = maxIdResult && maxIdResult.max ? parseInt(maxIdResult.max) + 1 : 1;
    
    return t.one(`
        INSERT INTO forecasts (
            id, location_id, date_id, hour, temperature, wind_direction, wind_speed,
            precipitation, cloud_type, is_rain, is_thunderstorm, is_snow, is_hail
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13
        ) RETURNING *
    `, [
        newId,
        forecast.location_id, 
        forecast.date_id, 
        forecast.hour, 
        forecast.temperature,
        forecast.wind_direction, 
        forecast.wind_speed, 
        forecast.precipitation, 
        forecast.cloud_type,
        forecast.is_rain, 
        forecast.is_thunderstorm, 
        forecast.is_snow, 
        forecast.is_hail
    ]);
}

// Update для адміністратора
const updateForecastAdmin = (db, updates) =>
    db.result(`
        UPDATE forecasts SET
            temperature = COALESCE($[temperature], temperature),
            wind_speed = COALESCE($[wind_speed], wind_speed),
            precipitation = COALESCE($[precipitation], precipitation),
            cloud_type = COALESCE($[cloud_type]::enum_cloud_type, cloud_type),
            wind_direction = COALESCE($[wind_direction]::enum_wind_direction, wind_direction),
            is_rain = COALESCE($[is_rain], is_rain),
            is_thunderstorm = COALESCE($[is_thunderstorm], is_thunderstorm),
            is_snow = COALESCE($[is_snow], is_snow),
            is_hail = COALESCE($[is_hail], is_hail)
        WHERE location_id = $[location_id] AND date_id = $[date_id] AND hour = $[hour]
    `, { ...updates });

// Delete для адміністратора
const deleteForecastAdmin = (db, toDelete) => 
    db.result(`
        DELETE FROM forecasts WHERE location_id = $[location_id] AND date_id = $[date_id] AND hour = $[hour]
    `, {...toDelete});

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