var itcqApp = angular.module('itcqApp', ['ngRoute']);

// Routing: https://docs.angularjs.org/tutorial/step_07
itcqApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/quiz', {
            templateUrl: 'tmpl/quiz.html'
        }).
            when('/about', {
            templateUrl: 'tmpl/about.html'
        }).
        when('/statistics', {
            templateUrl: 'tmpl/statistics.html'
        }).
        when('/admin', {
            templateUrl: 'tmpl/admin.html'
        }).
        when('/', {
            templateUrl: 'tmpl/main.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);





// Service named 'dataReceiver': https://docs.angularjs.org/guide/services
itcqApp.factory('dataReceiver', function($http) {
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
                console.log("ERROR: "+data);
                return false;
            } else if ('error' in data) {
                this.throwError("Query error: "+data.error);
                console.log("ERROR: "+data);
                return false;
            } else {
                return true;
            }
        },

        getData: function (type) {
            var thisService = this;
            console.log('itcqApp: getData started with request: '+type);

            return $http.get('../../api/api.php?request='+type)
                .success(function(data) {
                    if (thisService.validateData(data)) {
                        console.log("itcqApp: getData was successful. Returning info.");
                        return data;
                    }
                });
        }
    };
});





// Quiz controller
itcqApp.controller('quizCtrl', function ($scope, quizFactory) {
    $scope.checkAnswer = function(number) {
        console.log("quizCtrl: answer pressed, ID: "+number+" | Buttons disabled.");
        $scope.answerChosen = true;

        if (number == $scope.correctAnswer) {
            console.log("quizCtrl: correct answer clicked. Setting $scope.correct to: "+number);
            $scope.correct = $scope.correctAnswer;
        } else {
            console.log("quizCtrl: wrong answer clicked. Setting $scope.wrong to: "+number);
            $scope.wrong = number;
            $scope.correct = $scope.correctAnswer;
        }
    };

    $scope.nextQuestion = function() {
        $scope.answerChosen = false;
        $scope.correct = null;
        $scope.wrong = null;

        console.log("Trying to load question.");

        quizFactory.getQuestion().then(function (response) {
            $scope.question = response.question;
            $scope.answer1 = response.answer1;
            $scope.answer2 = response.answer2;
            $scope.answer3 = response.answer3;
            $scope.answer4 = response.answer4;
            $scope.correctAnswer = response.correct;
        });
    };
});





// Menu and view controller
itcqApp.controller('viewCtrl', function ($scope, $location) {
    if ($location.path() === '/quiz') {
        console.log("viewCtrl: /quiz path detected, redirecting to main");
        $location.path("/");
    }

    // For the ng-class feature on the menu items. Returns true if the current path is the same as given on the parameter.
    $scope.menuIsActive = function(path) {
        if ($location.path() == path || (path == '/' && $location.path() == '/quiz')) return true; else return false;
    };
});





// Statistics creation controller
itcqApp.controller('statsCtrl', function ($scope, dataReceiver) {
    // $http returns a promise, so I have to use 'then' to iterate it
    dataReceiver.getData('stats').then(function(response) {
        $scope.stats = response.data;
    });
});





// Factory that creates the JSON of a question
itcqApp.factory('quizFactory', function (dataReceiver) {
    return {
        getQuestion: function() {
            return dataReceiver.getData('qst').then(function(response) {
                qst = response.data;

                question = {
                    'id': qst.id,
                    'question': qst.question,
                    'answer1': qst.answer,
                    'answer2': qst.answer,
                    'answer3': qst.answer,
                    'answer4': qst.answer,
                    'correct': 2
                };

                console.log("quizFactory: question queried, returned question with ID "+question.id);

                console.log(question);
                return question;
            });
        }
    };
});
