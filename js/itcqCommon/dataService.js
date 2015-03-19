angular
    .module('dataServiceModule', [])
    .service('dataService', dataService);

function dataService($http, $rootScope, $compile, $location) {
    var openModals = 1;

    return {
        throwError: throwError,
        throwSuccess: throwSuccess,
        validateData: validateData,
        getData: getData,
        postData: postData,
        tryToLogin: tryToLogin,
        tryToLogout: tryToLogout
    };

    /* Adds error modal div to alert-messages div */
    function throwError(error) {
        var scope = $('html').scope();
        var errorDiv =  "<div class='modal-popup box-shadow modal-nr-"+openModals+"'>"+
                            "<div class='close-modal button-no' data-ng-click='closeModal("+openModals+")'><h1>&#10007;</h1></div>"+
                            "<h3>"+error+"</h3>"+
                        "</div>";
        $compile($('#alert-messages').append(errorDiv))(scope);
        openModals++;
    }

    /* Adds success modal div to alert-messages div */
    function throwSuccess(message) {
        var scope = $('html').scope();
        var successDiv =    "<div class='modal-popup box-shadow modal-nr-"+openModals+"'>"+
                                "<div class='close-modal button-yes' data-ng-click='closeModal("+openModals+")'><h1>&#10003;</h1></div>"+
                                "<h3>"+message+"</h3>"+
                            "</div>";
        $compile($('#alert-messages').append(successDiv))(scope);
        openModals++;
    }

    /* Validates data retrieved from the API and returns true if it's JSON and doesn't contain errors */
    function validateData(data) {
        if (data === null) {
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
    }

    /* Retrieves data from API using GET method */
    function getData(type, id) {
        $rootScope.loading = true;

        var ts = this;
        console.log('dataService: getData started with request: '+type);

        var request = (id) ? "?request="+type+"&id="+id : "?request="+type;

        return $http.get('../api/api.php'+request)
            .success(function(data) {
                if (ts.validateData(data)) console.log("dataService: getData was successful. Returning info.");
                $rootScope.loading = false;
            })
            .error(function(data, header) {
                ts.validateData(data);
                $rootScope.loading = false;
            });
    }

    function postData(type, jsonData) {
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

    /* Prepares data and posts it to auth API */
    function tryToLogin(credentials) {
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
    }

    /* Runs logout script */
    function tryToLogout() {
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
}
