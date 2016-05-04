"use strict";

let request = require('supertest');
let assert = require('assert');
let cheerio = require('cheerio');
let app = require('./../src/app')();

describe('User welcome page', () => {
    it('should display json with proper message.', (done) => {
        request(app)
            .get('/')
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
});