angular
    .module('itcqApp')
    .controller('ViewController', ViewController);

function ViewController($scope, $location, dataService, $rootScope) {
    /* Location path redirect: can't start in /quiz view */
    if ($location.path() === '/quiz') {
        console.log("ViewController: /quiz path detected, redirecting to main");
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
        console.log("Removed modal popup with ID: "+id);
        $('.modal-nr-'+id).remove();
    };
}
