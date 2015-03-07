/**
 * dataService is a service that is used to receive data from the PHP API
 * Guide from: https://docs.angularjs.org/guide/services
 */

angular
    .module('itcqApp')
    .factory('dataService', dataService)

function dataService($http) {
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
            var thisService = this;
            console.log('itcqApp: getData started with request: '+type);

            return $http.get('../api/api.php?request='+type)
                .success(function(data) {
                    if (thisService.validateData(data)) {
                        console.log("itcqApp: getData was successful. Returning info.");
                        return data;
                    }
                })
                .error(function(data, header) {
                    error.throwError("API returned error: "+header);
                    console.log(data);
                });
        }
    };
};
