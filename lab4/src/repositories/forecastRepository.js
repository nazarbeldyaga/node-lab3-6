const pool = require('../config/database');

// Асинхронні методи з async/await
const getLocations = async () => {
    try {
        const result = await pool.query('SELECT * FROM locations ORDER BY id');
        return result.rows;
    } catch (error) {
        console.error('Помилка при отриманні локацій:', error);
        throw error;
    }
};

const getDates = async () => {
    try {
        const result = await pool.query("SELECT id, to_char(date, 'YYYY-MM-DD') as date, is_weekend FROM dates ORDER BY date");
        return result.rows;
    } catch (error) {
        console.error('Помилка при отриманні дат:', error);
        throw error;
    }
};

const getForecasts = async () => {
    try {
        const result = await pool.query(`
            SELECT 
                f.id, 
                f.location_id, 
                f.date_id, 
                f.hour, 
                f.temperature, 
                f.cloud_type::text, 
                f.wind_direction::text, 
                f.wind_speed
            FROM forecasts f
            ORDER BY f.location_id, f.date_id, f.hour
        `);
        return result.rows;
    } catch (error) {
        console.error('Помилка при отриманні прогнозів:', error);
        throw error;
    }
};

// Отримати прогнози за локацією та датою
const getForecastsByLocationAndDate = async (locationId, dateId) => {
    try {
        const result = await pool.query(`
            SELECT 
                f.id, 
                f.location_id, 
                f.date_id, 
                f.hour, 
                f.temperature, 
                f.cloud_type::text, 
                f.wind_direction::text, 
                f.wind_speed,
                f.precipitation,
                f.is_rain,
                f.is_thunderstorm,
                f.is_snow,
                f.is_hail
            FROM forecasts f
            WHERE f.location_id = $1 AND f.date_id = $2
            ORDER BY f.hour
        `, [locationId, dateId]);
        return result.rows;
    } catch (error) {
        console.error('Помилка при отриманні прогнозів за локацією та датою:', error);
        throw error;
    }
};

// Отримати локацію за id
const getLocationById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Помилка при отриманні локації за id:', error);
        throw error;
    }
};

// Отримати дату за датою
const getDateByDateString = async (dateStr) => {
    try {
        const result = await pool.query("SELECT id, to_char(date, 'YYYY-MM-DD') as date, is_weekend FROM dates WHERE date = $1::date", [dateStr]);
        return result.rows[0];
    } catch (error) {
        console.error('Помилка при отриманні дати за рядком дати:', error);
        throw error;
    }
};

module.exports = {
    getLocations,
    getDates,
    getForecasts,
    getForecastsByLocationAndDate,
    getLocationById,
    getDateByDateString
};