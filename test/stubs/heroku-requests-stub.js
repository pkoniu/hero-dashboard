module.exports = () => {
    return {
        getAllApps: () => {
            return Promise.resolve(require('./../resources/app1-data.json'));
        },
        getAppStatus: () => {
            return Promise.resolve();
        },
        getAppAddons: () => {
            return Promise.resolve(require('./../resources/app1-addons.json'));
        }
    };
};