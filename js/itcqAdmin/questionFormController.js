(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('QuestionFormController', QuestionFormController);

    function QuestionFormController($scope, $location, $http, dataService, $routeParams) {
        $scope.imageId = 'default';
        var suggestionMode = ($routeParams.suggestionId !== undefined) ? true : false;

        /* Prepares question data (json) and posts it to API */
        $scope.submitForm = function(q) {
            if (q) {
                var jsonData = {'question': q.question, 'category': q.category, 'answer': q.answer, 'wrong1': q.wrong1,'wrong2': q.wrong2,'wrong3': q.wrong3, 'enabled': q.enabled, 'level': q.level};
                dataService.postData('addNewQuestion', jsonData, true, true).then(function(response) {
                    if (response.status == 200 && suggestionMode) {
                        var jsonData = {'suggestionId': $routeParams.suggestionId};
                        dataService.postData('deleteSuggestion', jsonData, true, true, true);
                    }
                });


            } else {
                dataService.throwError("Question data was empty.");
            }
        };

        /* Prepares category data (json) and posts it to API */
        $scope.addNewCategory = function(q) {
            if (q) {
                console.log("QuestionFormController: Category data received. Passing onto API.");
                var jsonData = {'category': q.category};
                dataService.postData('newCategory', jsonData, true, true);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };

        /* Retrieves suggestion data from API and sets it to scope */
        $scope.fillSuggestionData = function(id) {
            console.log('QuestionEditController: fillSuggestionData started for id: '+id);

            dataService.getData('suggestionData', id).then(function(response) {
                if (response.data !== null) {
                    $scope.q = response.data;
                    $scope.q.answer = response.data.correct_answer;
                    if (response.data.image_url !== '') {
                        $('#question-image').css('background-image', "url('"+response.data.image_url+"')");
                    }
                }
            });
        };

        if (suggestionMode) {
            $scope.fillSuggestionData($routeParams.suggestionId);
        }
    }
})();
