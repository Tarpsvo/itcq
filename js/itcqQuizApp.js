var itcqQuizApp = angular.module('itcqQuizApp', [
    'ngRoute'
    ]);

itcqQuizApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/quiz', {
        templateUrl: 'tmpl/quiz.html',
        controller: 'itcqQuizCtrl'
      }).
      when('/', {
        templateUrl: 'tmpl/main.html',
        controller: 'itcqQuizCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);