angular
    .module('itcqAdmin')
    .factory('errorService', errorService)

// Service named 'error': https://docs.angularjs.org/guide/services
function errorService() {
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

        throwSuccess: function(text) {
            alert(text);
        }
    };
};
