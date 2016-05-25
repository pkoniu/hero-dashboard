app.controller('AppsListController', function ($scope, Apps) {


    $scope.apps = [];
    refreshList();


    function refreshList(){
        Apps.getAppsList().then(function (apps) {
            $scope.apps = apps;
        })
    }

});