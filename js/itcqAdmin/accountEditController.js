(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('AccountEditController', AccountEditController);

    function AccountEditController($scope, $location, $http, dataService, $routeParams, $rootScope) {
        /* Retrieves account data from API and sets it to scope */
        $scope.fillAccountData = function (id) {
            console.log('AccountDataController: fillAccountData started for id: '+id);

            dataService.getData('accountData', id).then(function(response) {
                if (response.data !== null) $scope.acc = response.data;
            });
        };

        /* Prepares form data (JSON) and posts it to API */
        $scope.submitForm = function(acc) {
            if (acc) {
                var jsonData = {'accountId': $routeParams.accountId, 'username': acc.username, 'account': acc.account};
                console.log(jsonData);
                dataService.postData('editAccount', jsonData, true, true);
            } else {
                dataService.throwError("Account data was empty.");
            }
        };

        /* Sends delete request to API */
        $scope.deleteAccount = function() {
            var confirm = window.confirm("Are you sure you want to delete this user?");

            if (confirm) {
                if ($routeParams.accountId !== null) {
                    var jsonData = {'accountId': $routeParams.accountId};
                    dataService.postData('deleteAccount', jsonData, true, true);
                } else {
                    dataService.throwError("Account ID not set!");
                }
            }
        };

        /* If user opened the edit link, fill the data (just another failsafe) */
        if ($routeParams.accountId !== null) {
            $scope.fillAccountData($routeParams.accountId);
        }
    }
})();
