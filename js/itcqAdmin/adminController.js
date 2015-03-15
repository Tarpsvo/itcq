angular
    .module('itcqAdmin')
    .controller('AdminController', AdminController)

function AdminController($scope, $location, $http, dataService, $window, $rootScope) {
    // Check if the queried menu link is the active page
    $scope.menuIsActive = function(path) {
        if ($location.path() == path) return true; else return false;
    };

    $scope.fillData = function (type) {
        console.log('AdminController: fillData started with type: '+type);

        dataService.getData(type).then(function(response) {
            if (response.data != null) {
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

    $scope.openQuestionEditView = function(id) {
        $window.location = '#/questions/'+id;
    };
}
