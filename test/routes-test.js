"use strict";

let request = require('supertest');
let assert = require('assert');
let cheerio = require('cheerio');

describe('Hero-Dash REST API', () => {
    let app;

    before(() => {
        let herokuRequests = require('./stubs/heroku-requests-stub')();
        let cache = require('./../src/cache/in-memory-cache')();
        app = require('./../src/app')(herokuRequests, cache);
    });

    it('should display json with proper message as welcome', (done) => {
        request(app)
            .get('/api')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    let welcomeMessage = res.body.message;
                    assert.equal(welcomeMessage, 'Hello!');
                    done();
                }
            });
    });

    it('should list all apps when requested', (done) => {
        request(app)
            .get('/api/apps')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    let appList = res.body;
                    let testApp = appList.app1;
                    assert.equal(testApp.prop1, "val1");
                    assert.equal(testApp.prop2, "val2");
                    assert.equal(testApp.savedAt, "Wed May 04 2016 23:46:41 GMT+0200 (CEST)");
                    done();
                }
            });
    });
});