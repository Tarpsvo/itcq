angular
    .module('itcqApp')
    .controller('LoginController', LoginController)

function LoginController($scope, dataService, $location) {
    $scope.login = function() {
        console.log("LoginController: trying your login data.");

        dataService.tryToLogin($scope.credentials).then(function (response) {
            window.location = '/admin';
        });
    };
};
