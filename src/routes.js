"use strict";

let moment = require('moment');

module.exports = (herokuRequests, cache, packageJSON) => {
    return {
        welcome: (req, res, next) => {
            res.status(200).json({
                message: "Hello!"
            });
        },
        getApps: (req, res, next) => {
            herokuRequests.getAllApps()
                .then((apps) => {
                    res.status(200).json(apps);
                });
        },
        getApp: (req, res, next) => {
            let appName = req.params.app;

            cache.retrieve(appName)
                .then((appDetailsFromCache) => {
                    if (appDetailsFromCache) {
                        return Promise.resolve(appDetailsFromCache);
                    } else {
                        return herokuRequests.getAppDetails(appName);
                    }
                })
                .then((appDetails) => {
                    cache.store(appDetails, moment().add(1, 'd'))
                        .then((cacheSize) => {
                            console.log("Current cache size is", cacheSize);
                            res.status(200).json(appDetails);
                        });
                })
                .catch((err) => {
                    next(err);
                });
        },
        about: (req, res, next) => {
            res.status(200).send({
                authors: packageJSON.authors,
                repo: packageJSON.repository.url,
                readme: packageJSON.homepage
            });
        },
        getProfile: (req, res, next) => {
            res.status(200).json(req.user);
        },
        logout: (req, res, next) => {
            req.logout();
            res.status(200).send('Logged out.');
        }
    };
};