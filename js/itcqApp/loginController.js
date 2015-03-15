angular
    .module('itcqApp')
    .controller('LoginController', LoginController)

function LoginController($scope, dataService, $location, $window) {
    $scope.login = function() {
        console.log("LoginController: trying your login data.");

        dataService.tryToLogin($scope.credentials).then(function (response) {
            if (response.data !== null && 'success' in response.data) {
                window.location = '/admin';
            } else {
                dataService.throwError("Unknown error on login.");
            };
        });
    };

    $scope.logout = function() {
        dataService.tryToLogout().then(function (response) {
            if (response.data !== null && 'success' in response.data) {
                console.log("Log out finished.");
                $window.location.reload();
            } else {
                dataService.throwError("Unknown error on login.");
            };
        });
    };
};
