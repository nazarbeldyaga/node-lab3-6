const pgp = require('pg-promise')();
const path = require('path');
const dotenv = require('dotenv');

// Завантаження змінних середовища
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Ініціалізація бази даних
const db = pgp({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB
});

// Перевірка з'єднання
(async () => {
    try {
        const now = await db.one('SELECT NOW()');
        console.log('Підключення до бази даних успішне. Поточний час:', now.now);
    } catch (error) {
        console.error('Помилка підключення до бази даних при ініціалізації:', error);
    }
})();

module.exports = db;