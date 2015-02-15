var itcqAdmin = angular.module('itcqAdmin', [
    'ngRoute'
    ]);

// Routing: https://docs.angularjs.org/tutorial/step_07
itcqAdmin.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/questions', {
            templateUrl: 'tmpl/questions.html'
        }).
            when('/statistics', {
            templateUrl: 'tmpl/statistics.html'
        }).
            when('/addquestion', {
            templateUrl: 'tmpl/newquestion.html'
        }).
        otherwise({
            redirectTo: '/questions'
        });
    }
]);

itcqAdmin.controller('itcqAdminCtrl', function ($scope, $location, $http) {
    $scope.menuIsActive = function(path) {
        if ($location.path() == path) return true; else return false;
    };

    $scope.getQuestionList = function() {
        console.log("itcqAdminCtrl: getQuestionList getting questions.");

        $http.get('http://localhost/api/api.php?request=ql').
            success(function(data) {
                console.log("itcqAdminCtrl: getQuestionList was successful. Assigning to scope.");
                $scope.questionList = data;
            });
    };
});
