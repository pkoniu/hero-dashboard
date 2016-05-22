"use strict";

let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let passport = require('passport');
let GithubStrategy = require('passport-github').Strategy;

module.exports = (herokuRequests, cache, packageJSON) => {
    let app = express();
    let routes = require('./routes')(herokuRequests, cache, packageJSON);

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(__dirname + '/../public'));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('User saved in DB: ', user.name);
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        console.log('Deserializing user.');
        done(null, user);
    });

    passport.use(new GithubStrategy({
            clientID: process.env.GITHUB_KEY || 'GITHUB_KEY',
            clientSecret: process.env.GITHUB_SECRET || 'GITHUB_SECRET',
            callbackURL: process.env.APP_DOMAIN + '/auth/github/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

            var profileData = {
                name: profile.displayName,
                nick: profile.username,
                provider: profile.provider,
                providerData: providerData
            };

            done(null, profileData);
        }
    ));

    app.get('/api', routes.welcome);
    app.get('/api/apps', routes.getApps);
    app.get('/about', routes.about);

    app.get('/auth/github', passport.authenticate('github', {scope:['user']}));
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
        (req, res) => {
            res.redirect('/');
        });


    // error handlers as middlewares
    app.use((req, res, next) => {
        //let error = new Error('Not Found');
        //error.status = 404;
        //next(error);
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
