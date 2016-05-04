"use strict";

let cache = require('./../src/cache/in-memory-cache')();
let exampleData = require('./resources/app1-data');
let assert = require('assert');

describe('In memory cache', () => {
    it('should contain one element when one element saved.', (done) => {
        cache.put(exampleData);
        let mapSize = cache.size();
        assert.equal(mapSize, 1);
        done();
    });

    it('should return proper data when prompted to.', (done) => {
        cache.put(exampleData);
        let actual = cache.get("app1");
        assert.equal(actual.prop1, "val1");
        assert.equal(actual.prop2, "val2");
        assert.equal(actual.savedAt, "Wed May 04 2016 23:46:41 GMT+0200 (CEST)");
        done();
    });
});
