"use strict";

let moment = require('moment');
let http = require('http');
let _ = require('lodash'); 

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

                    // What do we have: apps object { [appName]:[appProps], ...}
                    // What do we need: json from each app's /about endpoint
                    var appsAbout = {};

                    Object.keys(apps).forEach(
                        key => {
                            //var url = .... somehow get the url to /about endpoint of current key app
                            http.get(url, response => {
                                response.on("data", data => {
                                    appsAbout[key] = data;
                                });

                                response.on("error", error => {
                                    console.log(error);
                                });
                            });
                        }
                    );

                    res.status(200).json(_.merge(apps, appsAbout));
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