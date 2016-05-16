"use strict";

module.exports = function() {
    return {
        welcome: (req, res) => {
            res.status(200).json({
                message: "Hello!"
            });
        }
    };
};