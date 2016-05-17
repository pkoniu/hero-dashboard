module.exports = function(heroku) {
    return {
        getAllApps: function() {
            return heroku.apps().list();
        },
        getApp: function(appName) {
            return heroku.apps(appName).info();
        }
    };
};