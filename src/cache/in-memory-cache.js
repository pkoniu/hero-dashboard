"use strict";

let _ = require('lodash');

module.exports = () => {
  let cache = {};

  let putInMemory = (data) => {
    let appNames = Object.keys(data);
    appNames.map(function(appName) {
      cache[appName] = data[appName];
    });
    //todo: previous data will be overriden, it should override only time at which data was saved
  };

  let getFromMemory = (appName) => {
    return cache[appName];
  };

  let getSize = () => {
    return Object.keys(cache).length;
  };

  return {
    get: getFromMemory,
    put: putInMemory,
    size: getSize
  };
};
//todo: right now cache is pretty dumb, made only as a small mock, to make another task
