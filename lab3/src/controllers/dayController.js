const dayService = require('../services/dayService');

const searchByDay = async (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    const data = await dayService.getForecastByDateAndLocation(locationId, date);

    res.render('guest/day', {
        searchTerm: `${data.location?.name || 'Локація'} — ${date}`,
        locationName: data.location?.name || 'Невідомо',
        date: data.date?.date || null,
        isWeekend: data.date?.is_weekend,
        forecast: data.forecast || []
    });
};

module.exports = { searchByDay };
