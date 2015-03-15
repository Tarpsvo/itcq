/**
 * ViewController is used to redirect a user and manage some UI features
 */

angular
    .module('itcqApp')
    .controller('ViewController', ViewController)

function ViewController($scope, $location, dataService, $rootScope) {
    if ($location.path() === '/quiz') {
        console.log("viewCtrl: /quiz path detected, redirecting to main");
        $location.path("/");
    }

    // For the ng-class feature on the menu items. Returns true if the current path is the same as given on the parameter.
    $scope.menuIsActive = function(path) {
        if ($location.path() == path || (path == '/' && $location.path() == '/quiz')) return true; else return false;
    };

    // Run and get stats
    dataService.getData('stats').then(function(response) {
        $scope.stats = response.data;
    });

    $rootScope.$watch('loading', function(loading) {
        if (loading) { $('#loading').show(); console.log("DISPLAYING LOADING SCREEN"); }
        else $('#loading').hide();
    });
}
