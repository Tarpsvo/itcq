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
                    ts.validateData(data);
                    $rootScope.loading = false;
                });


        },

        tryToLogin: function(credentials) {
            $rootScope.loading = true;

            var ts = this;

            jsonData = {'username': credentials.username, 'password': credentials.password};

            return $http.post('../auth/login.php', jsonData)
                .success(function(data) {
                    if (ts.validateData(data)) {
                        console.log("dataService: data validation passed, giving data back to LoginController.");
                    }
                    $rootScope.loading = false;
                })
                .error(function(data, header) {
                    ts.validateData(data);
                    $rootScope.loading = false;
                });
        },

        tryToLogout: function() {
            $rootScope.loading = true;

            var ts = this;

            return $http.get('../auth/logout.php')
                .success(function(data) {
                    if (ts.validateData(data)) console.log("Successfully logged out, returning success message.");
                    $rootScope.loading = false;
                })
                .error(function(data, header) {
                    ts.validateData(data);
                    $rootScope.loading = false;
                });
        }
    };
};
