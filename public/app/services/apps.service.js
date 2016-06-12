app.factory('Apps', function ($http) {

    var service = {};

    service.getAppsList = getAppsList;
    service.getAppDetails = getAppDetails;

    return service;

    //////

    function getAppsList() {
        return $http.get('/api/apps').then(function (res) {
            return res.data
        })
    }

    function getAppDetails(appName) {
        return $http.get('/api/apps/' + appName).then(function (res) {
            return res.data
        });

    }

});