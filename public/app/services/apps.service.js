app.factory('Apps', function ($http) {

    var service = {};

    service.getAppsList = getAppsList;

    return service;

    //////

    function getAppsList(){
        return $http.get('/api/apps').then(function (res) {
            return res.data
        })
    }

});