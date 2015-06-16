angularApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'AppCtrl'
        })
        .otherwise('/');
});