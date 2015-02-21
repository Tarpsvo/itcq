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
    var question = quizFactory.getQuestion();

    $scope.question = question.question;
    $scope.answer1 = question.answer1;
    $scope.answer2 = question.answer2;
    $scope.answer3 = question.answer3;
    $scope.answer4 = question.answer4;
    $scope.correctAnswer = question.correct;

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

    $scope.reset = function() {
        $scope.answerChosen = false;
        $scope.correct = null;
        $scope.wrong = null;
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
itcqApp.factory('quizFactory', function () {
    var question = {
        'id': 0,
        'question': 'This is the first question that is multi-line and should display properly?',
        'answer1': 'Answer one',
        'answer2': 'Answer two',
        'answer3': 'Answer three',
        'answer4': 'Answer four',
        'correct': 4
    };

    var factory = {};
    factory.getQuestion = function() {
        console.log("quizFactory: question queried, returned question with ID "+question.id);
        return question;
    };


    return factory;
});
