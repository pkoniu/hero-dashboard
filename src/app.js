"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


module.exports = (herokuRequests, cache, packageJSON) => {
    let app = express();
    let routes = require('./routes')(herokuRequests, cache, packageJSON);

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(__dirname + '/../public'));

    app.get('/api', routes.welcome);
    app.get('/api/apps', routes.getApps);
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
