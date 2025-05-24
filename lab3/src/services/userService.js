const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Отримати всіх користувачів
const getAllUsers = async () => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Помилка при читанні файлу користувачів:', error);
        return [];
    }
};

// Знайти користувача за ім'ям користувача
const findUserByUsername = async (username) => {
    const users = await getAllUsers();
    return users.find(user => user.username === username);
};

// Перевірити пароль користувача
const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Створити нового користувача
const createUser = async (userData) => {
    const users = await getAllUsers();

    // Перевірка, чи користувач з таким ім'ям вже існує
    if (users.some(user => user.username === userData.username)) {
        throw new Error('Користувач з таким ім\'ям вже існує');
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Створення нового користувача
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        username: userData.username,
        password: hashedPassword,
        role: userData.role || 'guest'
    };

    // Додавання користувача до масиву
    users.push(newUser);

    // Збереження оновленого масиву у файл
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

    // Повертаємо користувача без пароля
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

module.exports = {
    getAllUsers,
    findUserByUsername,
    verifyPassword,
    createUser
};