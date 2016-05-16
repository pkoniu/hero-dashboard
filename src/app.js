"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


module.exports = () => {
    let app = express();
    let routes = require('./routes')();

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(__dirname + '/../public'));

    app.get('/api', routes.welcome);

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