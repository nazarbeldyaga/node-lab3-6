const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const findUserByUsername = async (username) => {
    const users = await userRepository.getUsers();
    return users.find(user => user.username === username);
};

const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const createUser = async (userData) => {
    const users = await userRepository.getUsers();

    if (users.some(user => user.username === userData.username)) {
        throw new Error('Користувач з таким ім\'ям вже існує');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: userData.username,
        password: hashedPassword,
        role: userData.role || 'guest',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await userRepository.saveUsers(users);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

module.exports = {
    findUserByUsername,
    verifyPassword,
    createUser
};
