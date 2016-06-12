module.exports = (heroku) => {
    return {
        getAllApps: () => {
            return heroku.apps().list();
        },
        getAppDetails: (appName) => {
            return heroku.apps(appName).info();
        },
        getAppStatus: (appName) => {
            return heroku.apps(appName).dynos().list();
        }
    };
};
