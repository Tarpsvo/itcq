angular
    .module('itcqAdmin')
    .controller('AdminController', AdminController)

function AdminController($scope, $location, $http, errorService) {
    // Check if the queried menu link is the active page
    $scope.menuIsActive = function(path) {
        if ($location.path() == path) return true; else return false;
    };

    $scope.getData = function (type) {
        console.log('itcqAdminCtrl: getData started with request: '+type);

        $http.get('../api/api.php?request='+type)
            .success(function(data) {
                if (errorService.validateData(data)) {
                    console.log("itcqAdminCtrl: getData was successful. Assigning to scope.");
                    switch (type) {
                        case 'ql':
                            $scope.questionList = data;
                        break;
                        case 'cat':
                            $scope.categoriesList = data;
                        break;
                        case 'stats':
                            $scope.stats = data;
                        break;
                    }
                }
            })
            .error(function(data, header) {
                errorService.throwError("API returned error: "+header);
                console.log(data);
            });
    };
};
