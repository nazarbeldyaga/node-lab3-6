const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/login', (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect('/calendar');
    }
    
    res.render('auth/login', { 
        title: 'Вхід в систему',
        error: req.query.error ? 'Невірний логін або пароль' : null
    });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userService.findUserByUsername(username);

        if (!user || !(await userService.verifyPassword(password, user.password))) {
            return res.redirect('/auth/login?error=1');
        }

        const { password: _, ...userWithoutPassword } = user;
        req.session.user = userWithoutPassword;

        if (user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect('/calendar');
    } catch (error) {
        console.error('Помилка при вході:', error);
        res.status(500).render('error', { 
            title: 'Помилка', 
            message: 'Сталася помилка при спробі входу. Спробуйте пізніше.' 
        });
    }
});

router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Реєстрація' });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('auth/register', { 
                title: 'Реєстрація',
                error: 'Паролі не співпадають',
                username
            });
        }

        const newUser = await userService.createUser({
            username,
            password,
            role: 'guest'
        });

        req.session.user = newUser;
        res.redirect('/calendar');
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