"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.status(401).send('Unauthorized.');
};

module.exports = (herokuRequests, cache, packageJSON, authMiddleware) => {

    authMiddleware = authMiddleware || isLoggedIn;

    let app = express();

    let routes = require('./routes')(herokuRequests, cache, packageJSON);
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(__dirname + '/../public'));
    app.use(session({secret: 'very_secret'}));
    app.use(require('./oauth/github-oauth')());

    app.get('/api', authMiddleware, routes.welcome);
    app.get('/api/apps', authMiddleware, routes.getApps);
    app.get('/api/apps/monitoring/:app', routes.monitorApp);
    app.get('/api/apps/:app', authMiddleware, routes.getApp);
    app.get('/api/profile', authMiddleware, routes.getProfile);
    app.get('/api/logout', authMiddleware, routes.logout);
    app.get('/about', routes.about);

    // error handlers as middlewares
    app.use((req, res, next) => {
        let error = new Error('Not Found');
        error.status = 404;
        next(error);
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        if (err.stack) console.error('Error: \n', err.stack);
        res.json({
            message: err.message,
            error: (process.env.NODE_ENV === 'production') ? {} : err
        });
    });

    return app;
};
