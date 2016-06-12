"use strict";

let moment = require('moment');
let request = require('good-guy-http')();

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
            let appDetailsToReturn;

            cache.retrieve(appName)
                .then((appDetailsFromCache) => {
                    if (appDetailsFromCache) {
                        return Promise.resolve(appDetailsFromCache);
                    } else {
                        return herokuRequests.getAppDetails(appName);
                    }
                })
                .then((appDetails) => {
                    appDetailsToReturn = appDetails;
                    return cache.store(appDetails, moment().add(1, 'd'));
                })
                .then((cacheSize) => {
                    console.log("Current cache size is", cacheSize);
                    return res.status(200).json(appDetailsToReturn);
                })
                .catch((err) => {
                    next(err);
                });
        },
        monitorApp: (req, res, next) => {
            let appName = req.params.app;

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            setInterval(() => {
                herokuRequests.getAppStatus(appName)
                    .then((dynos) => {
                        let firstDyno = dynos[0]; //todo: don't take only first dyno, look at all available
                        res.write('id: ' + firstDyno.id + '\n');
                        res.write('event: success\n');
                        res.write('data: ' + firstDyno.state + '\n\n');
                    })
                    .catch((error) => {
                        res.write('id: 3\n');
                        res.write('event: error\n');
                        res.send('data: ERROR\n\n');
                    });
            }, 2000);
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