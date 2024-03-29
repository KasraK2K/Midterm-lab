const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet')
var cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware')
var passport = require('passport');
const methodOverride = require('method-override');
const multer = require('multer');
const Helpers = require('./middleware/Helpers');

require('app-module-path').addPath(__dirname);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:             'mySecretKey',
    resave:             true,
    saveUninitialized:  true,
    cookie:             {expires: new Date(Date.now() + 1000 * 60 * 60 * 5)},
    store:              new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(cookieParser());
app.use(flash());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

// Helpers
app.use((req, res, next) => {
    app.locals = new Helpers(req, res).getLocalsVariable();
    next();
});

// passport
require('passport/passport-local');

// Database
require('bootstrap/db');

// Routes
app.use(require('routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
