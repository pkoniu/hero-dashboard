module.exports = () => {
    return {
        getAllApps: () => {
            return Promise.resolve(require('./../resources/app1-data.json'));
        }
    };
};