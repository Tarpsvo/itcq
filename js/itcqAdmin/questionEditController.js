angular
    .module('itcqAdmin')
    .controller('QuestionEditController', QuestionEditController)

// Post data: learned from https://docs.angularjs.org/api/ng/directive/input
function QuestionEditController($scope, $location, $http, dataService, $routeParams, $rootScope) {
    $scope.fillQuestionData = function (id) {
        console.log('QuestionEditController: fillQuestionData started for id: '+id);

        dataService.getData('qstData', id).then(function(response) {
            if (response.data != null) $scope.q = response.data;
            console.log($scope.q);
        });
    };

    $scope.submitForm = function(q) {
        if (q) {
            var jsonData = {'question': q.question, 'category': q.category, 'answer': q.answer, 'wrong1': q.wrong1,'wrong2': q.wrong2,'wrong3': q.wrong3, 'enabled': q.enabled, 'id': $routeParams.questionId};
            console.log("Posting to API with type: editQst");
            console.log(jsonData);
            dataService.postData('editQst', jsonData);
        } else {
            dataService.throwError("Question data was empty.");
        }
    };

    $scope.deleteQuestion = function() {
        if ($routeParams.questionId != null) {
            var jsonData = {'questionId': $routeParams.questionId};
            dataService.postData('delQst', jsonData);
        } else {
            dataService.throwError("Question ID not set!");
        }
    };

    if ($routeParams.questionId != null) {
        $scope.editMode = true;

        // Wait for data loading to finish before writing data
        $rootScope.$watch('dataFilled', function(dataFilled) {
            if (dataFilled) {
                $scope.fillQuestionData($routeParams.questionId);
            }
        });
    }
};
