angular
    .module('itcqAdmin')
    .controller('AdminController', AdminController);

function AdminController($scope, $location, $http, dataService, $window, $rootScope) {
    /* If menu is currently open (path), return true */
    $scope.menuIsActive = function(path) {
        if ($location.path() == path) return true; else return false;
    };

    /* For question edit mode: queries data from API and sets question data to scope */
    $scope.fillData = function (type) {
        console.log('AdminController: fillData started with type: '+type);

        dataService.getData(type).then(function(response) {
            if (response.data !== null) {
                switch (type) {
                    case 'ql':
                        $scope.questionList = response.data;
                    break;
                    case 'cat':
                        $scope.categoriesList = response.data;
                    break;
                    case 'stats':
                        $scope.stats = response.data;
                    break;
                }
            }
            $rootScope.dataFilled = true;
        });
    };

    /* Opens question edit mode */
    $scope.openQuestionEditView = function(id) {
        $window.location = '#/questions/'+id;
    };

    /* Closes modal popup */
    $scope.closeModal = function(id) {
        console.log("Tried to remove modal with ID: "+id);
        $('.modal-nr-'+id).remove();
    };
}
