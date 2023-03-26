ModifiQApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/home/:tipo/:id', {
        cache: false,
        templateUrl: 'views/home/home.html',
        controller: 'homeController'
    }).when('/aula/:tipo/:camera/:microfone/:sala/ver', {
        cache: false,
        templateUrl: 'views/aula/aula.html',
        controller: 'aulaController'
    }).otherwise({redirectTo: '/'});
});