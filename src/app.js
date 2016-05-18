"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


module.exports = (herokuRequests, cache) => {
    let app = express();
    let routes = require('./routes')(herokuRequests, cache);

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(__dirname + '/../public'));

    app.get('/api', routes.welcome);
    app.get('/api/apps', routes.getApps);

    //error handlers as middlewares
    //app.use((req, res, next) => {
    //    let error = new Error('Not Found'); //todo: after instantiating the error is thrown immediately -- hence the comment
    //    error.status = 404;
    //    next(error);
    //});

    if(app.get('env') === 'development') { //with stacktrace
        app.use((err, req, res, next) => {
            console.error("Error stack: ", err.stack);
            res.status(err.status || 500).send(err.message);
        });
    }

    app.use((err, req, res, next) => { //no stacktrace on prod
        res.status(err.status || 500).send(err.message);
    });

    return app;
};
