/*"use strict";

let cache = require('./../src/cache/in-memory-cache')();
let app = require('./../src/app')();
let exampleApp = require('./resources/app1-data');
let request = require('supertest');
let assert = require('assert');
let cheerio = require('cheerio');

describe('List of apps', () => {
    it('should display json with one app', (done) => {
        cache.put(exampleApp);
        
        request(app)
            .get('/apps/')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    let appList = res.body.getList();
                    console.log(appList)
                    let testApp = appList["app1"]
                    assert.equal(testApp.prop1, "val1");
	    		    assert.equal(testApp.prop2, "val2");
    	    		assert.equal(testApp.savedAt, "Wed May 04 2016 23:46:41 GMT+0200 (CEST)");
                    done();
                }
            });
    });
});*/
        