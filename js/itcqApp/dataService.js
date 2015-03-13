/**
 * dataService is a service that is used to receive data from the PHP API
 * Guide from: https://docs.angularjs.org/guide/services
 */

angular
    .module('itcqApp')
    .factory('dataService', dataService)

function dataService($http, $rootScope) {
    return {
        throwError: function(error) {
            alert(error);
        },

        // Return true if everything is correct
        validateData: function(data) {
            if (data == '') {
                this.throwError("Query error: did not return anything.");
                return false;
            } else if (typeof data === 'string') {
                this.throwError("Query error: returned data was not JSON.");
                console.log("ERROR: "+data);
                return false;
            } else if ('error' in data) {
                this.throwError("Query error: "+data.error);
                console.log("ERROR: "+data);
                return false;
            } else {
                return true;
            }
        },

        getData: function (type) {
            $rootScope.loading = true; // Loading started!

            var ts = this;
            console.log('dataService: getData started with request: '+type);

            return $http.get('../api/api.php?request='+type)
                .success(function(data) {
                    if (ts.validateData(data)) console.log("dataService: getData was successful. Returning info.");
                    $rootScope.loading = false;
                })
                .error(function(data, header) {
                    ts.throwError("API returned error: "+header);
                    console.log(data);
                    $rootScope.loading = false;
                });


        },

        tryToLogin: function(credentials) {
            $rootScope.loading = true;

            var ts = this;
            var valid;

            jsonData = {'username': credentials.username, 'password': credentials.password};

            return $http.post('../auth/login.php', jsonData)
                .success(function(data) {
                    if (ts.validateData(data)) {
                        console.log("dataService: data validation passed, giving data back to LoginController.");
                    }
                    $rootScope.loading = false;
                })
                .error(function(data, header) {
                    if (data != null && 'error' in data) {
                        ts.throwError("Error: "+data.error);
                    } else {
                        ts.throwError("API returned error: "+header);
                        console.log("---- API ERROR ----");
                        console.log(data);
                        console.log("---- API ERROR ----");
                    }
                    $rootScope.loading = false;
                });
        }
    };
};
