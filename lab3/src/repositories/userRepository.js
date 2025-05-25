const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Отримати всіх користувачів з файлу
const getUsers = async () => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Помилка при читанні файлу користувачів:', error);
        return [];
    }
};

// Зберегти користувачів у файл
const saveUsers = async (users) => {
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Помилка при збереженні файлу користувачів:', error);
        throw error;
    }
};

module.exports = {
    getUsers,
    saveUsers
};
