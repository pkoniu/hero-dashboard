"use strict";

module.exports = (herokuRequests, cache) => {
    return {
        welcome: (req, res) => {
            res.status(200).json({
                message: "Hello!"
            });
        },
        getApps: (req, res) => {
            herokuRequests.getAllApps()
                .then((apps) => {
                    res.status(200).json(apps);
                });
        }
    };
};