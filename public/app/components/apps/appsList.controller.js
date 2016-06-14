app.controller('AppsListController', function ($scope, Apps) {


    $scope.apps = [];

    $scope.selectedApp = null;

    $scope.monitors = Apps.monitors;
    refreshList();

    $scope.selectApp = function (app) {
        $scope.selectedApp = app;
    };

    $scope.closeSelected = function () {
        $scope.selectedApp = null;
    };

    $scope.switchLiveStatus = function (app) {
        Apps.liveMonitor(app);
    };


    function refreshList() {
        Apps.getAppsList().then(function (apps) {
            $scope.apps = apps;
        })
    }

});