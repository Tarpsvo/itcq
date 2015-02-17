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

    $scope.getCategories = function() {
        console.log("itcqAdminCtrl: getCategories quering categories.");

        $http.get('http://localhost/api/api.php?request=cat')
            .success(function(data) {
                console.log("itcqAdminCtrl: getCategories was successful. Assigning to scope.");
                $scope.categoriesList = data;
            });
    };
});

// Learned from https://docs.angularjs.org/api/ng/directive/input
itcqAdmin.controller('questionFormCtrl', function ($scope, $location, $http) {
    $scope.addNewQuestion = function() {
        if ($scope.q) {
            console.log("itcqAdmin: questionFieldCtrl: Question data received. Passing onto API.");
            $scope.passDataToAPI($scope.q);
            console.log($scope.q);
        }
    };

    $scope.passDataToAPI = function($info) {
        console.log("Posting the following: ");
        console.log('request: add, question:'+ $info.question+ ',category:'+ $info.category+ ',answer:'+ $info.answer+ ',wrong:'+ $info.wrong+ ',enabled:' +$info.enabled);
        $http.post('../api/api.php', {'request': 'add', 'question': $info.question, 'category': $info.category, 'answer': $info.answer, 'wrong': $info.wrong, 'enabled': $info.enabled})
            .success(function() {
                console.log("itcqAdmin: questionFieldCtrl: question data successfully passed to API.");
            })
            .error(function(data, status) { // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.errors.push(status);
            });
    }
});
