(function() {
    'use strict';

    angular
        .module('itcqAdmin')
        .controller('QuestionEditController', QuestionEditController);

    function QuestionEditController($scope, $location, $http, dataService, $routeParams, $rootScope) {
        $scope.imageId = 'default';
        $scope.random = Math.random();
        $scope.has_image = false;
        var imageChanged = false;
        var imageDeleted = false;

        /* Retrieves question data from API and sets it to scope */
        $scope.fillQuestionData = function(id) {
            console.log('QuestionEditController: fillQuestionData started for id: '+id);

            dataService.getData('questionData', id).then(function(response) {
                if (response.data !== null) {
                    $scope.q = response.data;
                    if (response.data.has_image == 1) {
                        $scope.has_image = true;
                        $scope.imageId = $routeParams.questionId;
                    }
                }
            });
        };

        /* Prepares form data (JSON) and posts it to API */
        $scope.submitForm = function(q) {
            if (q) {
                if (imageChanged) {
                    var imageUpdateJson = {'request': 'saveImage', 'questionId': $routeParams.questionId};
                    $http({
                        method: 'POST',
                        url: '../api/imageUpload.php',
                        data: $.param(imageUpdateJson),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function(data) {
                        console.log("Successfully saved image.");
                    })
                    .error(function(data) {
                        dataService.validateData(data);
                    });
                } else if (imageDeleted) {
                    var imageDeleteJson = {'request': 'deleteImage', 'questionId': $routeParams.questionId};
                    $http({
                        method: 'POST',
                        url: '../api/imageUpload.php',
                        data: $.param(imageDeleteJson),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                    .success(function(data) {
                        console.log("Successfully posted image delete request.");
                    })
                    .error(function(data) {
                        dataService.validateData(data);
                    });
                }

                var jsonData = {'question': q.question, 'category': q.category, 'answer': q.answer, 'wrong1': q.wrong1,'wrong2': q.wrong2,'wrong3': q.wrong3, 'enabled': q.enabled, 'id': $routeParams.questionId, 'level': q.level};
                dataService.postData('editQuestion', jsonData, true, true);
            } else {
                dataService.throwError("Question data was empty.");
            }
        };

        /* Sends delete request to API */
        $scope.deleteQuestion = function() {
            var confirm = window.confirm("Are you sure you want to delete this question?");

            if (confirm) {
                if ($routeParams.questionId !== null) {
                    var jsonData = {'questionId': $routeParams.questionId};
                    dataService.postData('deleteQuestion', jsonData, true, true);
                } else {
                    dataService.throwError("Question ID not set!");
                }
            }
        };

        /* Sends delete image request to image API */
        $scope.deleteImage = function() {
            var confirm = window.confirm("Are you sure you want to delete this image? Don't forget to save afterwards.");

            if (confirm) {
                if ($routeParams.questionId !== null) {
                    $('#question-image').css('background-image', "url('../img/questions/default.jpg')");
                    imageDeleted = true;
                    console.log("Set image CSS to default: didn't actually delete it yet (waiting for save).");
                } else {
                    dataService.throwError("Question ID not set!");
                }
            }
        };

        /* Passes the file to the API in an attempt to upload it */
        $scope.uploadFile = function(files) {
            var formData = new FormData();
            formData.append('file', files[0]);
            formData.append('request', 'uploadTemp');
            formData.append('questionId', $routeParams.questionId);

            $http.post('../api/imageUpload.php', formData, {
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
            .success(function(data) {
                dataService.validateData(data);
                $('#question-image').css('background-image', "url('../img/questions/"+$routeParams.questionId+"_temp.jpg?"+Math.random()+"')");
                imageChanged = true;
            })
            .error(function(data) {
                dataService.validateData(data);
            });
};

        /* If the user opened the edit link, set editMode to true */
        if ($routeParams.questionId !== null) {
            $scope.editMode = true;

            /* Wait for categories to load before setting data */
            $rootScope.$watch('dataFilled', function(dataFilled) {
                if (dataFilled) {
                    $scope.fillQuestionData($routeParams.questionId);
                }
            });
        }
    }
})();
