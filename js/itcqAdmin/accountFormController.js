(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('AccountFormController', AccountFormController);

    function AccountFormController($scope, $location, $http, dataService) {
        /* Prepares question data (json) and posts it to API */
        $scope.submitForm = function(acc) {
            if (acc) {
                console.log("AccountFormController: Question data received. Passing onto API.");
                var jsonData = {'username': acc.username, 'password': acc.password, 'account': acc.account};
                dataService.postData('newAccount', jsonData, true, true);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };
    }
})();
