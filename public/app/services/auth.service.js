app.service('Auth', function ($http, $rootScope) {

    var service = {
        currentUser: null
    };

    service.init = init;

    service.logout = logout;

    return service;

    //////

    function init(){
        $rootScope.USER_LOGGED = false;
        return $http.get('/api/profile').then(function () {
            $rootScope.USER_LOGGED = true;
        });
    }

    function logout(){
        return $http.get('/api/logout');
    }


});