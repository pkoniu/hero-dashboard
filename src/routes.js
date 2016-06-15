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
            let cachedApps = cache.storedEntries; //spytanie o wszystkie appki
            let appsToReturn = [];
            let storePromises = [];
            let mergePromises = []; 
            let aboutPromises = [];

            if(cachedApps === undefined){
                herokuRequests.getAllApps()
                    .then((apps) => {
                        return Promise.resolve(apps);
                    })
                    .then( (apps) => {
                        appsToReturn = apps;
                        apps.forEach( function(app){
                            aboutPromises.push( request(app.web_url.concat("about")) );
                        })
                        return Promise.all(aboutPromises);
                    })
                    .then( (appsAbouts) => {
                        for(var i=0; i<appsAbouts.length; i++){
                            mergePromises.push( Promise.resolve(_.merge(appsToReturn[i], JSON.parse( appsAbouts[i].body))) );
                        }
                        return Promise.all(mergePromises);
                     })
                     .then( () => {
                        appsToReturn.forEach( function(app){
                            storePromises.push(cache.store(app, moment().add(1, 'd'))); 
                        });
                        return Promise.all(storePromises);
                    })
                    .then( (result) => {
                        console.log(result);
                        return res.status(200).json(appsToReturn);
                    })
                    .catch( (err) => {
                        next(err);
                    });
            } else {
                res.status(200).json(cachedApps);
            }
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