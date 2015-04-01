(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('QuestionEditController', QuestionEditController);

    function QuestionEditController($scope, $location, $http, dataService, $routeParams, $rootScope) {
        /* Retrieves question data from API and sets it to scope */
        $scope.fillQuestionData = function (id) {
            console.log('QuestionEditController: fillQuestionData started for id: '+id);

            dataService.getData('questionData', id).then(function(response) {
                if (response.data !== null) $scope.q = response.data;
            });
        };

        /* Prepares form data (JSON) and posts it to API */
        $scope.submitForm = function(q) {
            if (q) {
                var jsonData = {'question': q.question, 'category': q.category, 'answer': q.answer, 'wrong1': q.wrong1,'wrong2': q.wrong2,'wrong3': q.wrong3, 'enabled': q.enabled, 'id': $routeParams.questionId};
                console.log(jsonData);
                dataService.postData('editQuestion', jsonData, true, true);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };

        /* Sends delete request to API */
        $scope.deleteQuestion = function() {
            var confirm = window.confirm("Are you sure you want to delete this question?");

            if (confirm) {
                if ($routeParams.questionId !== null) {
                    var jsonData = {'questionId': $routeParams.questionId};
                    dataService.postData('deleteQuestion', jsonData, true, true);
                } else {
                    dataService.throwError("Question ID not set!");
                }
            }
        };

        /* If the user opened the edit link, set editMode to true */
        if ($routeParams.questionId !== null) {
            $scope.editMode = true;

            /* Wait for categories to load before setting data */
            $rootScope.$watch('dataFilled', function(dataFilled) {
                if (dataFilled) {
                    $scope.fillQuestionData($routeParams.questionId);
                }
            });
        }
    }
})();
