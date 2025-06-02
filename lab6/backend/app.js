var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var authRouter = require('./src/routes/authRoutes');
var adminRouter = require('./src/routes/adminRoutes');
var calendarRouter = require('./src/routes/calendarRoutes');
var forecastApiRouter = require('./src/routes/forecast');
var locationApiRouter = require('./src/routes/location');
var errorHandler = require('./src/middlewares/errorHandler');
const { sequelize } = require('./src/config/sequelize');

var app = express();

// view engine setup
const expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main.ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Передача DB до контексту
app.set('db', sequelize);

// Роути
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/calendar', calendarRouter);
app.use('/api/forecasts', forecastApiRouter);
app.use('/api/locations', locationApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

module.exports = app;