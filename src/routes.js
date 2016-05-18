"use strict";

module.exports = (herokuRequests, cache) => {
    return {
        welcome: (req, res) => {
            res.status(200).json({
                message: "Hello!"
            });
        },
        getApps: (req, res) => {
            var list = cache.getAll();
            if (cache.size() === 0) {
                list = herokuRequests.getAllApps();
            }
            res.status(200).json(list);
        }
    };
};