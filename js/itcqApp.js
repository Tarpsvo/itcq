(function() {
    'use strict';

    angular
        .module('itcqApp', ['ngRoute', 'dataServiceModule'])
        .config(['$routeProvider',
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
                .when('/login', {
                    templateUrl: 'tmpl/login.php'
                })
                .when('/', {
                    templateUrl: 'tmpl/main.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
            }
        ])
        .run(function($rootScope) {
            $rootScope.loading = false;
        });
})();
