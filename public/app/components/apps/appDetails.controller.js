app.controller('AppDetailsController', function ($scope, $state, Apps) {
    var appName = $state.params.app;
    $scope.app = {};
    refreshApp();


    function refreshApp() {
        Apps.getAppDetails(appName).then(function (appDetails) {
            $scope.appDetails = appDetails;
        });
    }

});