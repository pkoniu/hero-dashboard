var heroin = require('heroin-js');

var configurator = heroin(process.env.HEROKU_API_TOKEN, {logLevel: 'DEBUG'});

configurator({
    name: 'hero-dash',
    region: 'eu',
    maintenance: false,
    stack: 'cedar-14',
    config_vars: {
        HEROKU_API_TOKEN: process.env.HEROKU_API_TOKEN,
        NODE_ENV: 'production'
    },
    addons: {},
    collaborators: [
        'mk.chomik@gmail.com',
        'patryk.konior@gmail.com'
    ]
});

