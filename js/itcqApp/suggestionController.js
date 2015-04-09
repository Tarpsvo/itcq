(function() {
    'use strict';

    angular
        .module('itcqApp')
        .controller('SuggestionController', SuggestionController);

    function SuggestionController($scope, $location, dataService, $rootScope, $cookieStore) {
        /* Posts suggestion form to the API */
        $scope.suggestQuestion = function(q) {
            console.log("SuggestionController: posting suggestion data to API.");
            console.log(q);

            dataService.postData('addQuestionSuggestion', q, true, true).then(function (response) {
                console.log("Success, apparently.");
            });
        };
    }
})();
