const forecastRepository = require('../repositories/forecastRepository');

const getLocations = async (req, res) => {
    try {
        const db = req.app.get('db');
        const locations = await forecastRepository.getLocations(db);
        return locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getLocations,
};