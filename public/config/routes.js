angularApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'AppCtrl'
        })
        .when('/feedback', {
            templateUrl: 'views/feedback.html',
            controller: 'FeedbackCtrl'
        })
        .otherwise('/');
});
