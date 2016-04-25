"use strict";

module.exports.welcome = (req, res) => {
    res.status(200).json({
        message: "Hello!"
    });
};