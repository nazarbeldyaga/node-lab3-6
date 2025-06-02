const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DateModel = sequelize.define('Date', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    date: DataTypes.DATEONLY,
    is_weekend: DataTypes.BOOLEAN
}, {
    tableName: 'dates',
    timestamps: false
});

module.exports = DateModel;
