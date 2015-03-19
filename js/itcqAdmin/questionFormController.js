(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('QuestionFormController', QuestionFormController);

    function QuestionFormController($scope, $location, $http, dataService) {
        /* Prepares question data (json) and posts it to API */
        $scope.submitForm = function(q) {
            if (q) {
                console.log("QuestionFormController: Question data received. Passing onto API.");
                var jsonData = {'request': 'add', 'question': q.question, 'category': q.category, 'answer': q.answer, 'wrong1': q.wrong1,'wrong2': q.wrong2,'wrong3': q.wrong3, 'enabled': q.enabled};
                dataService.postData('add', jsonData);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };

        /* Prepares category data (json) and posts it to API */
        $scope.addNewCategory = function(q) {
            if (q) {
                console.log("QuestionFormController: Category data received. Passing onto API.");
                var jsonData = {'category': q.category};
                dataService.postData('newcat', jsonData);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };
    }
})();
