"use strict";

let request = require('supertest');
let assert = require('assert');
let cheerio = require('cheerio');
let app = require('./../src/app')();

describe('Frontend public files', () => {
    it('should be loaded properly.', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    let pageBody = res.text;
                    assert(pageBody.indexOf('App is loading') > 0);
                    done();
                }
            });
    });
});