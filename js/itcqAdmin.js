var itcqAdmin = angular.module('itcqAdmin', ['ngRoute']);

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





// Service named 'error': https://docs.angularjs.org/guide/services
itcqAdmin.factory('error', function() {
    return {
        throwError: function(error) {
            alert(error);
        },

        // Return true if everything is correct
        validateData: function(data) {
            if (data == '') {
                this.throwError("Query error: did not return anything.");
                return false;
            } else if (typeof data === 'string') {
                this.throwError("Query error: returned data was not JSON.");
                return false;
            } else if ('error' in data) {
                this.throwError("Query error: "+data.error);
                return false;
            } else {
                return true;
            }
        },

        throwSuccess: function(text) {
            alert(text);
        }
    };
});





// Get data
itcqAdmin.controller('itcqAdminCtrl', function ($scope, $location, $http, error) {
    // Check if the queried menu link is the active page
    $scope.menuIsActive = function(path) {
        if ($location.path() == path) return true; else return false;
    };

    // Get the list of questions
    $scope.getQuestionList = function() {
        console.log('itcqAdminCtrl: getQuestionList getting questions.');

        $http.get('../api/api.php?request=ql')
            .success(function(data) {
                if (error.validateData(data)) {
                    console.log("itcqAdminCtrl: getQuestionList was successful. Assigning to scope.");
                    $scope.questionList = data;
                }
            });
    };

    // Get the list of categories
    $scope.getCategories = function() {
        console.log("itcqAdminCtrl: getCategories quering categories.");

        $http.get('../api/api.php?request=cat')
            .success(function(data) {
                if (error.validateData(data)) {
                    console.log("itcqAdminCtrl: getCategories was successful. Assigning to scope.");
                    $scope.categoriesList = data;
                }
            });
    };
});





// Post data: learned from https://docs.angularjs.org/api/ng/directive/input
itcqAdmin.controller('questionFormCtrl', function ($scope, $location, $http, error) {
    $scope.addNewQuestion = function() {
        if ($scope.q) {
            console.log("itcqAdmin: questionFieldCtrl: Question data received. Passing onto API.");
            $scope.passDataToAPI($scope.q);
        } else {
            returnError("Question data was empty.");
        }
    };

    $scope.passDataToAPI = function($info) {
        $http.post('../api/api.php?request=add', {'request': 'add', 'question': $info.question, 'category': $info.category, 'answer': $info.answer, 'wrong': $info.wrong, 'enabled': $info.enabled})
            .success(function(data) {
                console.log("itcqAdmin: questionFieldCtrl: question data successfully passed to API.");
                if ('success' in data) {
                    error.throwSuccess("Successfully posted data.");
                    $location.path("#/questions");
                }
            })
            .error(function(data, status) {
                returnError("Failed to post: "+status);
            });
    }
});
