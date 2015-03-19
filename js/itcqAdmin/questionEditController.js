(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('QuestionEditController', QuestionEditController);

    function QuestionEditController($scope, $location, $http, dataService, $routeParams, $rootScope) {
        /* Retrieves question data from API and sets it to scope */
        $scope.fillQuestionData = function (id) {
            console.log('QuestionEditController: fillQuestionData started for id: '+id);

            dataService.getData('qstData', id).then(function(response) {
                if (response.data !== null) $scope.q = response.data;
                console.log("QuestionEditController: Question data added to scope.");
            });
        };

        /* Prepares form data (JSON) and posts it to API */
        $scope.submitForm = function(q) {
            if (q) {
                var jsonData = {'question': q.question, 'category': q.category, 'answer': q.answer, 'wrong1': q.wrong1,'wrong2': q.wrong2,'wrong3': q.wrong3, 'enabled': q.enabled, 'id': $routeParams.questionId};
                console.log("Posting to API with type: editQst");
                console.log(jsonData);
                dataService.postData('editQst', jsonData);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };

        /* Sends delete request to API */
        $scope.deleteQuestion = function() {
            if ($routeParams.questionId !== null) {
                var jsonData = {'questionId': $routeParams.questionId};
                dataService.postData('delQst', jsonData);
            } else {
                dataService.throwError("Question ID not set!");
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
