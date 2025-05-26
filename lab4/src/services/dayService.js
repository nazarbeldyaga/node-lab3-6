const forecastRepository = require('../repositories/forecastRepository');

const getForecastByDateAndLocation = async (locationId, dateStr) => {
    try {
        // Отримуємо інформацію про локацію
        const location = await forecastRepository.getLocationById(locationId);
        if (!location) {
            return { location: null, date: null, forecast: [] };
        }

        // Отримуємо інформацію про дату
        const date = await forecastRepository.getDateByDateString(dateStr);
        if (!date) {
            return { location, date: null, forecast: [] };
        }

        // Отримуємо прогноз
        const forecast = await forecastRepository.getForecastsByLocationAndDate(locationId, date.id);

        return { location, date, forecast };
    } catch (error) {
        console.error('Помилка при отриманні прогнозу:', error);
        throw error;
    }
};

module.exports = { getForecastByDateAndLocation }