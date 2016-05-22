'use strict';

let express = require('express');
let passport = require('passport');
let GithubStrategy = require('passport-github').Strategy;

module.exports = () => {
    let app = express();

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('User saved in DB: ', user.name); //todo: save user to real db
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        console.log('Deserializing user.');
        done(null, user);
    });

    passport.use(new GithubStrategy({
            clientID: process.env.GITHUB_KEY || 'GITHUB_KEY',
            clientSecret: process.env.GITHUB_SECRET || 'GITHUB_SECRET',
            callbackURL: process.env.APP_DOMAIN + 'auth/github/callback'
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

    app.get('/auth/github', passport.authenticate('github', {scope:['user']})); //todo: is this the scope we really need?
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), //todo: failure redirect goes probably wrong
        (req, res) => {
            res.redirect('/'); //todo: success redirect too
        });

    return app;
};
