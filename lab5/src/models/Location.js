const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Location = sequelize.define('Location', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING
}, {
    tableName: 'locations',
    timestamps: false
});

module.exports = Location;
