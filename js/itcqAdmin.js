(function() {
    'use strict';

    angular
        .module('itcqAdmin', ['ngRoute', 'dataServiceModule'])
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                .when('/questions', {
                    templateUrl: 'tmpl/questions.html',
                })
                .when('/questions/:questionId', {
                    templateUrl: 'tmpl/newquestion.html',
                    controller: 'QuestionEditController'
                })
                .when('/statistics', {
                    templateUrl: 'tmpl/statistics.html'
                })
                .when('/addquestion', {
                    templateUrl: 'tmpl/newquestion.html',
                    controller: 'QuestionFormController'
                })
                .when('/addcategory', {
                    templateUrl: 'tmpl/newcategory.html'
                })
                .when('/newaccount', {
                    templateUrl: 'tmpl/newaccount.html',
                    controller: 'AccountFormController'
                })
                .when('/accounts', {
                    templateUrl: 'tmpl/accounts.html'
                })
                .when('/accounts/:accountId', {
                    templateUrl: 'tmpl/showaccount.html',
                    controller: 'AccountEditController'
                })
                .when('/suggestions', {
                    templateUrl: 'tmpl/suggestions.html'
                })
                .when('/suggestions/:suggestionId', {
                    templateUrl: 'tmpl/viewsuggestion.html',
                    controller: 'SuggestionViewController'
                })
                .when('/questions/suggest/:suggestionId', {
                    templateUrl: 'tmpl/newquestion.html',
                    controller: 'QuestionFormController'
                })
                .otherwise({
                    redirectTo: '/questions'
                });
            }
        ])
        .run(function ($rootScope) {
            $rootScope.dataFilled = false;
        });
})();
