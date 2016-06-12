"use strict";

let _ = require('lodash');
let moment = require('moment');

let setup = () => {
    let storedEntries = {};

    var evict = (key) => {
        storedEntries = _.omit(storedEntries, [key]);
        return Promise.resolve();
    };

    var alreadyExists = (data) => {
        return !!storedEntries[data.name];
    };

    var isExpired = (entry) => {
        let expirationDate = entry.expiresOn;
        let now = moment();

        return now.isAfter(expirationDate);
    };

    let retrieve = (key) => {
        let entry = storedEntries[key];

        if (!entry) {
            return Promise.resolve(undefined);
        }

        if (isExpired(entry)) {
            evict(key);
            return Promise.resolve(undefined);
        }

        return Promise.resolve(_.omit(entry, ['storedAt']).data);
    };

    // expiresOn is moment object
    let store = (data, expiresOn) => {
        if (alreadyExists(data)) {
            return Promise.resolve(Object.keys(storedEntries).length);
        }

        storedEntries[data.name] = {
            expiresOn: expiresOn,
            data: _.omit(data, [data.name])
        };

        return Promise.resolve(Object.keys(storedEntries).length);
    };

    return {retrieve, store};
};

module.exports = setup;
