app.controller('AppsListController', function ($scope, Apps) {


    $scope.apps = [];
    $scope.monitors = Apps.monitors;
    refreshList();

    $scope.switchLiveStatus = function (app) {
        Apps.liveMonitor(app);
    };

    $scope.restartApp = function (app) {
        Apps.restartApp(app.name);
    };


    function refreshList() {
        Apps.getAppsList().then(function (apps) {
            $scope.apps = apps;
        })
    }

});