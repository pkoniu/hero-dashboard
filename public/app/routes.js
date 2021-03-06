app.config(function ($stateProvider) {

    $stateProvider.state('appsList', {
        url: '/apps',
        templateUrl: 'app/components/apps/apps.component.html',
        controller: 'AppsListController'
    });

    $stateProvider.state('appDetails', {
        url: '/apps/:app',
        templateUrl: 'app/components/apps/appDetails.component.html',
        controller: 'AppDetailsController'
    });

    $stateProvider.state('settings', {
        url: '/settings',
        templateUrl: 'app/components/settings/settings.component.html'
    });

});