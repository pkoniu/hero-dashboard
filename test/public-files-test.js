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
                    let $ = cheerio.load(res.text);
                    let title = $('title').text();
                    assert.equal(title, "HeroDASH");
                    done();
                }
            });
    });
});