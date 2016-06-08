"use strict";

let moment = require('moment');

module.exports = (herokuRequests, cache, packageJSON) => {
    return {
        welcome: (req, res) => {
            res.status(200).json({
                message: "Hello!"
            });
        },
        getApps: (req, res) => {
            herokuRequests.getAllApps()
                .then((apps) => {
                    // Store all apps in cache
                    Object.keys(apps).forEach(
                        key => cache.store(apps[key], moment().add(7, 'days'))
                    );
                    res.status(200).json(apps);
                });
        },
        about: (req, res) => {
            res.status(200).send({
                authors: packageJSON.authors,
                repo: packageJSON.repository.url,
                readme: packageJSON.homepage
            });
        },
        getProfile: (req, res) => {
            res.status(200).json(req.user);
        },
        logout: (req, res) => {
            req.logout();
            res.status(200).send('Logged out.');
        }
    };
};