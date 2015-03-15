/**
 * dataService is a service that is used to receive data from the PHP API
 * Guide from: https://docs.angularjs.org/guide/services
 */

angular
    .module('itcqAdmin')
    .factory('dataService', dataService)

function dataService($http, $rootScope, $location) {
    return {
        throwError: function(error) {
            alert(error);
        },

        throwSuccess: function(msg) {
            alert(msg);
        },

        validateData: function(data) {
            if (data == null) {
                this.throwError("Query error: did not return anything.");
                return false;
            } else if (typeof data === 'string') {
                this.throwError("Query error: returned data was not JSON.");
                console.log("--- ERROR HERE ---");
                console.log(data);
                console.log("--- ERROR HERE ---");
                return false;
            } else if ('error' in data) {
                this.throwError("Query error: "+data.error);
                console.log("--- ERROR HERE ---");
                console.log(data);
                console.log("--- ERROR HERE ---");
                return false;
            } else {
                return true;
            }
        },

        getData: function (type, id) {
            $rootScope.loading = true;

            var ts = this;
            console.log('dataService: getData started with request: '+type);

            if (type === 'qstData') {
                var jsonData = {'id': id};
                return $http.post('../api/api.php?request='+type, jsonData)
                    .success(function(data) {
                        if (ts.validateData(data)) console.log("dataService: getData was successful. Returning info.");
                        $rootScope.loading = false;
                    })
                    .error(function(data, header) {
                        ts.validateData(data);
                        $rootScope.loading = false;
                    });
            } else {
                return $http.get('../api/api.php?request='+type)
                    .success(function(data) {
                        if (ts.validateData(data)) console.log("dataService: getData was successful. Returning info.");
                        $rootScope.loading = false;
                    })
                    .error(function(data, header) {
                        ts.validateData(data);
                        $rootScope.loading = false;
                    });
            }
        },

        postData: function(type, jsonData) {
            $rootScope.loading = true;

            var ts = this;
            console.log('dataService: postData started with type: '+type);
            console.log(jsonData);

            $http.post('../api/api.php?request='+type, jsonData)
                .success(function(data) {
                    console.log("dataService: question data successfully passed to API.");
                    if (ts.validateData(data)) {
                        $location.path("#/questions");
                        ts.throwSuccess(data.success);
                    }
                })
                .error(function(data, header) {
                    ts.validateData(data);
                });

        }
    }
}
