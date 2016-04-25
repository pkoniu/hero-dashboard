"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let routes = require('./routes');

module.exports = () => {
    let app = express();

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.get('/', routes.welcome);

    //error handlers as middlewares
    app.use((req, res, next) => {
        let error = new Error('Not Found');
        error.status = 404;
        next(error);
    });

    if (app.get('env') === 'development') { //with stacktrace
        app.use((err, req, res, next) => {
            res.status(err.stats || 500).send(err.message);
        });
    }

    app.use((err, req, res, next) => { //no stacktrace on prod
        res.status(err.status || 500).send(err.message);
    });

    return app;
};