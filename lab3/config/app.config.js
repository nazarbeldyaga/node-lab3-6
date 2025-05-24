require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3002,
    environment: 'development',
    session_secret: process.env.SESSION_SECRET || 'weather_forecast_secret_key',
    // інше
};
