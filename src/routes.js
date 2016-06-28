"use strict";

const moment = require('moment');
const request = require('good-guy-http')();
const _ = require('lodash');
const filter = require('./util/apps-addons-filter');

let getAboutData = (appUrl) => {
    return request(appUrl + 'about')
        .then((response) => {
            return JSON.parse(response.body);
        })
        .catch((error) => {
            return error;
        });
};

let assignHelper = (appsAddons) => {
    return {addons: appsAddons};
};

module.exports = (herokuRequests, cache, packageJSON) => {
    return {
        welcome: (req, res, next) => {
            res.status(200).json({
                message: "Hello!"
            });
        },
        getApps: (req, res, next) => {
            var allAppsData, allAppsAbout, allAppsAddons;
            herokuRequests.getAllApps()
                .then((apps) => {
                    allAppsData = apps;

                    return Promise.all(_.map(apps, (app) => {
                        return getAboutData(app.web_url);
                    }));
                })
                .then((allAppsAboutData) => {
                    allAppsAbout = allAppsAboutData;

                    return Promise.all(_.map(allAppsData, (app) => {
                        return herokuRequests.getAppAddons(app.name);
                    }));
                })
                .then((allAppsAddonsData) => {
                    allAppsAddons = allAppsAddonsData;

                    return Promise.resolve(_.map(allAppsData, (app, i) => {
                        return _.assignIn(allAppsAbout[i], app);
                    }));
                })
                .then((combinedAppsDetails) => {
                    return Promise.resolve(_.map(combinedAppsDetails, (app) => {
                        return _.pick(app, ['name', 'created_at', 'updated_at', 'web_url', 'repo', 'wiki'])
                    }));
                })
                .then((onlyNeededAppDetails) => {
                    return Promise.resolve(_.map(onlyNeededAppDetails, (app, i) => {
                        return _.assignIn(app, assignHelper(allAppsAddons[i]))
                    }));
                })
                .then((bla) => {
                    var final = _.map(bla, (app) => {
                        let repo = app.repo;

                        if (repo) {
                            repo = repo.slice(4);
                        } else {
                            repo = undefined;
                        }

                        return {
                            name: app.name,
                            updated: moment(app.updated_at).fromNow(),
                            created: moment(app.created_at).fromNow(),
                            gitUrl: repo,
                            logs: filter.getFilteredAddons(app.addons, filter.filterFunctions.isLoggingAddon),
                            metrics: filter.getFilteredAddons(app.addons, filter.filterFunctions.isMetricsAddon),
                            url: app.web_url
                        }
                    });

                    res.status(200).json(final);
                })
                .catch(next);
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
                        let firstDyno = dynos[0];
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
                readme: packageJSON.homepage,
                wiki: packageJSON.wiki
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