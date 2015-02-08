var itcqApp = angular.module('itcqApp', [
    'ngRoute'
    ]);

// Routing: https://docs.angularjs.org/tutorial/step_07
itcqApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/quiz', {
            templateUrl: 'tmpl/quiz.html'
        }).
        when('/', {
            templateUrl: 'tmpl/main.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

itcqApp.controller('quizCtrl', function ($scope, quizFactory) {
    var question = quizFactory.getQuestion();

    $scope.question = question.question;
    $scope.answer1 = question.answer1;
    $scope.answer2 = question.answer2;
    $scope.answer3 = question.answer3;
    $scope.answer4 = question.answer4;
});

// Controller that redirects to main page if client opens /quiz
itcqApp.controller('accessCtrl', function ($scope, $location) {
    if ($location.path() === '/quiz') {
        console.log("accessCtrl: /quiz path detected, redirecting to main");
        $location.path("/");
    }
});

// Factory that passes creates the JSON of a question
itcqApp.factory('quizFactory', function () {
    var question = {
        'id': 0,
        'question': 'This is the first question?',
        'answer1': 'Answer one',
        'answer2': 'Answer two',
        'answer3': 'Answer three',
        'answer4': 'Answer four'
    };

    var factory = {};
    factory.getQuestion = function() {
        console.log("quizFactory: question queried, returned question with ID "+question.id);
        return question;
    };


    return factory;
});