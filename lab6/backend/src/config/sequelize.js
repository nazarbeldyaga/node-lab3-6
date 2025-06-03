const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

// Завантаження змінних середовища
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;
