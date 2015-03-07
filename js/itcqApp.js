angular
    .module('itcqApp', ['ngRoute'])
    .config(['$routeProvider',          // Routing: https://docs.angularjs.org/tutorial/step_07
        function($routeProvider) {
            $routeProvider
            .when('/quiz', {
                templateUrl: 'tmpl/quiz.html'
            })
            .when('/about', {
                templateUrl: 'tmpl/about.html'
            })
            .when('/statistics', {
                templateUrl: 'tmpl/statistics.html'
            })
            .when('/admin', {
                templateUrl: 'tmpl/admin.html'
            })
            .when('/login', {
                templateUrl: 'tmpl/login.html'
            })
            .when('/', {
                templateUrl: 'tmpl/main.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        }
    ]);
