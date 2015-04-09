(function() {
    'use strict';

    angular
        .module('itcqApp', ['ngRoute', 'dataServiceModule', 'ngCookies'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/quiz', {
                    templateUrl: 'tmpl/quiz.html',
                    controller: 'QuizController'
                })
                .when('/about', {
                    templateUrl: 'tmpl/about.html'
                })
                .when('/statistics', {
                    templateUrl: 'tmpl/statistics.html'
                })
                .when('/login', {
                    templateUrl: 'tmpl/login.php',
                    controller: 'LoginController'
                })
                .when('/suggest', {
                    templateUrl: 'tmpl/suggest.html',
                    controller: 'SuggestionController'
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
