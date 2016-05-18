"use strict";

var heroku = require('heroku-client');
var cache = require('./cache/in-memory-cache')();

module.exports = function () {
    return {
        getList: (req, res) => {
            var list = cache.getAll();
            if(typeof list === 'undefind'){
            	list = heroku.getAllApps();
            }
            res.status(200).json(list);
        }
    };
};