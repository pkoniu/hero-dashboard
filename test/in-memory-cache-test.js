"use strict";

let assert = require('assert');
let moment = require('moment');

describe('Cache should', () => {
    let appData = {
        name: 'app1',
        someDetail: 'detail1',
        anotherDetail: 'detail2'
    };

    let anotherApp = {
        name: 'app2',
        someDetail: 'detail1',
        anotherDetail: 'detail2'
    };

    let cache;

    beforeEach(() => {
        cache = require('./../src/cache/in-memory-cache')(1);
    });

    it('store proper app data, support promises interface and return its size', (done) => {
        cache.store(appData, new Date())
            .then((cacheSize) => {
                assert.equal(cacheSize, 1);
                return cache.store(anotherApp, new Date());
            }).then((cacheSize) => {
                assert.equal(cacheSize, 2);
                done();
            }).catch(done);
    });

    it('store proper app data once', (done) => {
        cache.store(appData, new Date())
            .then((cacheSize) => {
                assert.equal(cacheSize, 1);
                return cache.store(appData, new Date());
            }).then((cacheSize) => {
                assert.equal(cacheSize, 1);
                done();
            }).catch(done);
    });

    it('return proper app data if it\'s not expired', (done) => {
        cache.store(appData, moment().add(7, 'days'))
            .then((cacheSize) => {
                return cache.retrieve('app1');
            }).then((retrievedData) => {
                assert.deepEqual(retrievedData, appData);
                done();
            }).catch(done);
    });

    it('not return data after it\' expired', (done) => {
        cache.store(appData, moment().subtract(7, 'days'))
            .then((cacheSize) => {
                return cache.retrieve('app1');
            }).then((retrievedData) => {
                assert.equal(retrievedData, undefined);
                done();
            }).catch(done);
    });
});