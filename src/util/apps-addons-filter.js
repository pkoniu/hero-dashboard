var _ = require('lodash');

module.exports = {
    getFilteredAddons: (addons, filter) => {
        return _.chain(addons)
            .map((addon) => {
                var addonName = addon.addon_service.name;

                if (filter(addonName)) {
                    return {
                        'name': addonName,
                        'url': addon.web_url
                    };
                }
            })
            .compact()
            .value()[0];
    },

    filterFunctions: {
        isLoggingAddon: (addonName) => {
            var loggingAddonsNames = ['logentries', 'flydata', 'papertrail'];
            return loggingAddonsNames.indexOf(addonName) !== -1;
        },

        isMetricsAddon: (addonName) => {
            var metricsAddonsNames = ['librato', 'traceview', 'stillalive', 'deadmanssnitch', 'hostedgraphite', 'pingdom', 'newrelic'];
            return metricsAddonsNames.indexOf(addonName) !== -1;
        }
    }
};


