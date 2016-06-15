"use strict";

module.exports = (redisClient, cacheTTL) => {
    return {
        get: (key, cb) => {
            let redisKey = 'heroku:api:' + key;
            console.log('## GET', redisKey);
            redisClient.GET(redisKey, cb);
        },
        set: (key, value) => {
            let redisKey = 'heroku:api:' + key;
            console.log('## SET', redisKey);
            redisClient.SETEX(redisKey, cacheTTL, value, (err) => {});
        }
    }
};