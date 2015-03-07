angular
    .module('itcqAdmin', ['ngRoute'])
    .config(['$routeProvider',          // Routing: https://docs.angularjs.org/tutorial/step_07
        function($routeProvider) {
            $routeProvider
            .when('/questions', {
                templateUrl: 'tmpl/questions.html'
            })
            .when('/statistics', {
                templateUrl: 'tmpl/statistics.html'
            })
            .when('/addquestion', {
                templateUrl: 'tmpl/newquestion.html'
            })
            .when('/addcategory', {
                templateUrl: 'tmpl/newcategory.html'
            })
            .otherwise({
                redirectTo: '/questions'
            });
        }
    ]);
