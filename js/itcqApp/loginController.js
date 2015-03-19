(function() {
    'use strict';

    angular
        .module('itcqApp')
        .controller('LoginController', LoginController);

    function LoginController($scope, dataService, $route, $templateCache, $rootScope, $window) {
        /* Passes the credentials to the API and checks the reply */
        $scope.login = function() {
            console.log("LoginController: trying your login data.");

            dataService.tryToLogin($scope.credentials).then(function (response) {
                if (response.data !== null && 'success' in response.data) {
                    $window.location = '/admin';
                } else {
                    dataService.throwError("Unknown error on login.");
                }
            });
        };

        /* Runs logout script */
        $scope.logout = function() {
            dataService.tryToLogout().then(function (response) {
                if (response.data !== null && 'success' in response.data) {
                    dataService.throwSuccess("Successfully logged out.");

                    $rootScope.loading = true;
                    $templateCache.remove($route.current.templateUrl);
                    $route.reload();
                    $rootScope.loading = false;

                    console.log("Log out finished.");
                } else {
                    dataService.throwError("Unknown error on logout.");
                }
            });
        };
    }
})();
