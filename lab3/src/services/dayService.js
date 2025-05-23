const searchByDay = async (dayId) => {
    const fs = require('fs').promises;
    const path = require('path');
    
    const datesFile = path.join(__dirname, '../data/dates.json');
    
    const dates = await fs.readFile(datesFile, 'utf8');
    console.log("BOOM")
    console.log((JSON.parse(dates)).filter(date => date.id == dayId))
    return (JSON.parse(dates)).filter(date => date.id == dayId);
};

module.exports = { searchByDay };