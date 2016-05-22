"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

let isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    else res.status(401).send('Unauthorized.');
};

module.exports = (herokuRequests, cache, packageJSON) => {
    let app = express();

    let routes = require('./routes')(herokuRequests, cache, packageJSON);
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(__dirname + '/../public'));
    app.use(session({secret:'very_secret'}));
    app.use(require('./oauth/github-oauth')());

    app.get('/api', isLoggedIn, routes.welcome);
    app.get('/api/apps', isLoggedIn, routes.getApps);
    app.get('/api/profile', isLoggedIn, routes.getProfile);
    app.get('/api/logout', isLoggedIn, routes.logout);
    app.get('/about', routes.about);

    // error handlers as middlewares
    app.use((req, res, next) => {
        let error = new Error('Not Found');
        error.status = 404;
        next(error);
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        if(err.stack) console.error('Error: \n', err.stack);
        res.json({
            message: err.message,
            error: (process.env.NODE_ENV === 'production') ? {} : err
        });
    });

    return app;
};
