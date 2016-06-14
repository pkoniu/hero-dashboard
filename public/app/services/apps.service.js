app.factory('Apps', function ($http, $rootScope) {

    var service = {};

    var currentMonitors = {};

    service.getAppsList = getAppsList;
    service.getAppDetails = getAppDetails;
    service.monitors = currentMonitors;

    service.liveMonitor = liveMonitor;

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


    function liveMonitor(app) {

        if (app.liveStatus) {

            var monitor = {};

            monitor.eventsource = new EventSource('/api/apps/monitoring/'+app.name);
            monitor.status = "loading..."

            monitor.eventsource.addEventListener('success', function(event) {
                monitor.status = event.data;
                $rootScope.$apply();
            }, false);

            monitor.eventsource.addEventListener('error', function(event) {
                if (event.target.readyState == EventSource.CLOSED) {
                    monitor.status = 'N/A - Connection to server closed.';
                }
                else if (event.target.readyState == EventSource.CONNECTING) {
                    monitor.status = 'N/A - Trying to reconnect...';
                }
                $rootScope.$apply();
            }, false);

            currentMonitors[app.name] = monitor;

        } else {

            currentMonitors[app.name].eventsource.close();
            delete currentMonitors[app.name];

        }

    }


});