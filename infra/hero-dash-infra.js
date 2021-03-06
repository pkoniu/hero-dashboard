var heroin = require('heroin-js');

var configurator = heroin(process.env.HEROKU_API_TOKEN, {logLevel: 'INFO'});

configurator({
    name: 'hero-dash',
    region: 'eu',
    maintenance: false,
    stack: 'cedar-14',
    config_vars: {
        HEROKU_API_TOKEN: process.env.HEROKU_API_TOKEN,
        NODE_ENV: 'production',
        GITHUB_KEY: process.env.GITHUB_KEY,
        GITHUB_SECRET: process.env.GITHUB_SECRET,
        APP_DOMAIN: process.env.APP_DOMAIN,
        REDIS_URL: process.env.REDIS_URL
    },
    addons: {
        'heroku-redis': {plan: 'heroku-redis:hobby-dev'},
        'librato': {plan: 'librato:development'},
        'logentries': {'plan': 'logentries:le_tryit'}
    },
    collaborators: [
        'mk.chomik@gmail.com',
        'patryk.konior@gmail.com',
        'patryk.lawski@gmail.com'
    ]
});

