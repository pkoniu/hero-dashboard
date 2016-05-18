"use strict";

module.exports = () => {
    let getAllFromMemory = () => {
        return require('./../resources/app1-data');
    };

    let getSize = () => {
        return 1;
    };

    return {
        getAll: getAllFromMemory,
        size: getSize
    };
};
