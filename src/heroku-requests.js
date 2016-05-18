module.exports = (heroku) => {
    return {
        getAllApps: () => {
            return heroku.apps().list();
        },
        getApp: (appName) => {
            return heroku.apps(appName).info();
        }
    };
};
