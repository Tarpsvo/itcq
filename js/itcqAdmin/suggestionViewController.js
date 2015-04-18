(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('SuggestionViewController', SuggestionViewController);

    function SuggestionViewController($scope, $location, $http, dataService, $routeParams) {
        /* Retrieves suggestion data from API and sets it to scope */
        $scope.fillSuggestionData = function (id) {
            console.log('SuggestionDataController: fillSuggestionData started for id: '+id);

            dataService.getData('suggestionData', id).then(function(response) {
                if (response.data !== null) $scope.s = response.data;
            });
        };

        /* Sends delete request to API */
        $scope.deleteSuggestion = function() {
            var confirm = window.confirm("Are you sure you want to delete this suggestion?");

            if (confirm) {
                if ($routeParams.questionId !== null) {
                    var jsonData = {'suggestionId': $routeParams.suggestionId};
                    dataService.postData('deleteSuggestion', jsonData, true, true);
                } else {
                    dataService.throwError("Suggestion ID not set!");
                }
            }
        };

        /* If user opened the edit link, fill the data (just another failsafe) */
        if ($routeParams.suggestionId !== null) {
            $scope.fillSuggestionData($routeParams.suggestionId);
        }
    }
})();
