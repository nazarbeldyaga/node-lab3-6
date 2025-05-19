const errorHandler = (err, req, res, next) => {
    // Логуємо деталі запиту та помилки
    console.error(`[${new Date().toISOString()}] Error occurred:`);
    console.error(`Method: ${req.method}, URL: ${req.url}`);
    console.error(`Status: ${err.status || 500}`);
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}\n`);

    // Обробка помилки
    if (err.status === 404) {
        return res.status(404).render('error', { title: '404 Not Found', message: 'Page not found' });
    }

    res.status(500).render('error', { title: 'Error', message: err.message || 'Something went wrong!' });
};

module.exports = errorHandler;