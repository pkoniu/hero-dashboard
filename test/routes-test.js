"use strict";

let request = require('supertest');
let assert = require('assert');
let cheerio = require('cheerio');

describe('Hero-Dash REST API', () => {
    let app;

    let authMiddleware = (req, res, next) => {
        next();
    };

    before(() => {
        let herokuRequests = require('./stubs/heroku-requests-stub')();
        let cache = require('./../src/cache/in-memory-cache')();
        let packageJSON = require(process.cwd() + '/package.json');
        app = require('./../src/app')(herokuRequests, cache, packageJSON, authMiddleware);
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
                    assert.equal(appList[0].created, 'a few seconds ago');
                    assert.equal(appList[0].logs.name, 'logentries');
                    assert.equal(appList[0].metrics.name, 'librato');
                    done();
                }
            });
    });

    it('should respond on about with proper data', (done) => {
        request(app)
            .get('/about')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    let about = res.body;
                    assert.deepEqual(about, {
                        authors: ["Patryk Konior", "Mateusz Kmiecik", "Patryk Ławski"],
                        repo: "git+https://github.com/pkoniu/hero-dashboard.git",
                        readme: "https://github.com/pkoniu/hero-dashboard#readme"
                    });
                    done();
                }
            });
    });
});