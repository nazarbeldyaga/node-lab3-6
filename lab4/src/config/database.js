const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Завантажуємо змінні середовища
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Створюємо пул підключень
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    port: 5433,
    database: process.env.POSTGRES_DB
});

// Додаємо обробники подій
pool.on('connect', () => {
    console.log('Успішне підключення до бази даних');
});

pool.on('error', (err) => {
    console.error('Помилка пулу підключень до бази даних:', err);
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Помилка підключення до бази даних при ініціалізації:', err);
    } else {
        console.log('Підключення до бази даних успішне. Поточний час на сервері:', res.rows[0].now);
    }
});

module.exports = pool;