(function() {
    'use strict';

    angular
        .module('itcqApp')
        .controller('ViewController', ViewController);

    function ViewController($scope, $location, dataService, $rootScope, $cookieStore) {
        /* Location path redirect: can't start in /quiz view */
        if ($location.path() === '/quiz') {
            console.log("ViewController: /quiz path detected, redirecting to main.");
            $location.path("/");
        }

        /* When page is loaded, populate statistics page */
        dataService.getData('stats').then(function(response) {
            $scope.stats = response.data;
        });

        /* When 'loading' changes to true, display loading screen and when it changes to 'false', hide the loading screen */
        $rootScope.$watch('loading', function(loading) {
            if (loading) $('#loading').show();
            else $('#loading').hide();
        });

        /* If menu is currently open (path), return true */
        $scope.menuIsActive = function(path) {
            if ($location.path() == path || (path == '/' && $location.path() == '/quiz')) return true; else return false;
        };

        /* Closes modal popupwith the specified id */
        $scope.closeModal = function(id) {
            $('.modal-nr-'+id).remove();
        };

        /* Fills personalStats variable for the statistics page */
        $scope.updatePersonalStats = function() {
            if ($cookieStore.get('itcq_data') !== undefined) {
                $scope.personalStats = $cookieStore.get('itcq_data');
                $scope.personalStats.correctPercentage = $scope.personalStats.numCorrectAnswers/$scope.personalStats.numAnswers*100;
                $scope.personalStats.correctPercentage = $scope.personalStats.correctPercentage.toFixed(1);
            } else {
                $scope.personalStats = {'level': 1, 'numAnswers': 0, 'numCorrectAnswers': 0, 'correctPercentage': 0};
            }
        };
    }
})();
