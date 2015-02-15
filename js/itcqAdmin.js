var itcqAdmin = angular.module('itcqAdmin', [
    'ngRoute'
    ]);

// Routing: https://docs.angularjs.org/tutorial/step_07
itcqAdmin.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/questions', {
            templateUrl: 'tmpl/questions.php'
        }).
            when('/statistics', {
            templateUrl: 'tmpl/statistics.php'
        }).
        otherwise({
            redirectTo: '/questions'
        });
    }
]);

itcqAdmin.controller('itcqAdminCtrl', function ($scope, $location) {

});
