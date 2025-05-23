const DayService = require('../services/dayService');

const searchByDay = async (req, res) => {
    const dayId = req.query.id || '';
    const day = await DayService.searchByDay(dayId);
    console.log(day)
    res.render('guest/day', { day, searchTerm: dayId });
};

module.exports = { searchByDay };