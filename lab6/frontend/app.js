const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const indexRouter = require("./src/routes/index");
const adminRouter = require("./src/routes/adminRoutes");
const calendarRouter = require("./src/routes/calendarRoutes");
const paginationRouter = require('./src/routes/paginationRoutes');
const authRouter = require("./src/routes/authRoutes");
const config = require("./config/app.config");

const app = express();

// view engine setup
const expressLayouts = require("express-ejs-layouts");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main.ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: config.session_secret,
        resave: false, // не зберігати сесію, якщо вона не змінилася
        saveUninitialized: false, // не створювати сесію, поки щось не збережено
        cookie: {
            secure: false, // true тільки для HTTPS
            maxAge: 3600000 // час життя cookie в мілісекундах (1 година)
        }
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/calendar", calendarRouter);
app.use("/auth", authRouter);
app.use('/pagination', paginationRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404, `Сторінку ${req.url} не знайдено`));
});

module.exports = app;
