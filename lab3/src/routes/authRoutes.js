const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/login', (req, res) => {
    // Якщо користувач вже увійшов, перенаправляємо його
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect('/guest');
    }
    
    res.render('auth/login', { 
        title: 'Вхід в систему',
        error: req.query.error ? 'Невірний логін або пароль' : null
    });
});

// Обробка форми входу
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Шукаємо користувача за ім'ям
        const user = await userService.findUserByUsername(username);
        
        // Якщо користувача не знайдено або пароль невірний
        if (!user || !(await userService.verifyPassword(password, user.password))) {
            return res.redirect('/auth/login?error=1');
        }
        
        // Зберігаємо інформацію про користувача в сесії (без пароля)
        const { password: _, ...userWithoutPassword } = user;
        req.session.user = userWithoutPassword;
        
        // Перенаправляємо відповідно до ролі
        if (user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect('/guest');
    } catch (error) {
        console.error('Помилка при вході:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: 'Сталася помилка при спробі входу. Спробуйте пізніше.' 
        });
    }
});

// Реєстрація нового користувача (опціонально)
router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Реєстрація' });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        
        // Перевірка паролів
        if (password !== confirmPassword) {
            return res.render('auth/register', { 
                title: 'Реєстрація',
                error: 'Паролі не співпадають',
                username
            });
        }
        
        // Створення нового користувача
        const newUser = await userService.createUser({
            username,
            password,
            role: 'guest' // За замовчуванням всі нові користувачі - гості
        });

        req.session.user = newUser;
        res.redirect('/guest');
    } catch (error) {
        console.error('Помилка при реєстрації:', error);
        res.render('auth/register', { 
            title: 'Реєстрація',
            error: error.message,
            username: req.body.username
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Помилка при виході:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;