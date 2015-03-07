angular
    .module('itcqAdmin')
    .controller('QuestionFormController', QuestionFormController)

// Post data: learned from https://docs.angularjs.org/api/ng/directive/input
function QuestionFormController($scope, $location, $http, errorService) {
    $scope.addNewQuestion = function() {
        if ($scope.q) {
            console.log("itcqAdmin: questionFormCtrl: Question data received. Passing onto API.");
            $scope.passDataToAPI($scope.q, 'add');
        } else {
            errorService.throwError("Question data was empty.");
        }
    };

    $scope.addNewCategory = function() {
        if ($scope.q) {
            console.log("itcqAdmin: questionFormCtrl: Category data received. Passing onto API.");
            $scope.passDataToAPI($scope.q, 'newcat');
        } else {
            errorService.throwError("Question data was empty.");
        }
    };

    $scope.passDataToAPI = function(info, type) {
        var jsonData;
        switch (type) {
            case 'add':
                jsonData = {'request': 'add', 'question': info.question, 'category': info.category, 'answer': info.answer, 'wrong1': info.wrong1,'wrong2': info.wrong2,'wrong3': info.wrong3, 'enabled': info.enabled};
            break;
            case 'newcat':
                jsonData = {'category': info.category};
            break;
        }

        console.log("Posting to API with type: "+type);
        console.log(jsonData);
        $http.post('../api/api.php?request='+type, jsonData)
            .success(function(data) {
                console.log("itcqAdmin: questionFieldCtrl: question data successfully passed to API.");
                if (errorService.validateData(data)) {
                    errorService.throwSuccess("Successfully posted data.");
                    $location.path("#/questions");
                }
            })
            .error(function(data, header) {
                errorService.throwError("API returned error: "+header);
                console.log(data);
            });
    }
};
