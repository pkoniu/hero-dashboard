var app = angular.module('hero-dash', ['ui.router']);

app.run(function (Auth, $state) {

    Auth.init().then(function () {
        $state.go('appsList');
    });

});

app.controller('main', function ($scope, Auth) {

    $scope.menu = [
        {
            title: 'Apps list',
            state: 'appsList'
        },
        {
            title: 'Settings',
            state: 'settings'
        }
    ];

    $scope.logout = function () {
        Auth.logout().then(function () {
            location.reload();
        })
    }

});