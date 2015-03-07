angular
    .module('itcqApp')
    .controller('QuizController', QuizController)

function QuizController($scope, questionFactory) {
    $scope.checkAnswer = function(number) {
        console.log("quizController: answer pressed, ID: "+number+" | Buttons disabled.");
        $scope.answerChosen = true;

        if (number == $scope.correctAnswer) {
            $scope.correct = $scope.correctAnswer;
        } else {
            $scope.wrong = number;
            $scope.correct = $scope.correctAnswer;
        }
    };

    $scope.nextQuestion = function() {
        $scope.answerChosen = false;
        $scope.correct = null;
        $scope.wrong = null;

        console.log("Trying to load question.");

        questionFactory.getQuestion().then(function (response) {
            $scope.question = response.question;
            correct = Math.floor((Math.random() * 4) + 1); // Random between 1-4

            switch (correct) {
                case 1:
                    $scope.answer1 = response.answer;
                    $scope.answer2 = response.wrong1;
                    $scope.answer3 = response.wrong2;
                    $scope.answer4 = response.wrong3;
                break;
                case 2:
                    $scope.answer1 = response.wrong1;
                    $scope.answer2 = response.answer;
                    $scope.answer3 = response.wrong2;
                    $scope.answer4 = response.wrong3;
                break;
                case 3:
                    $scope.answer1 = response.wrong1;
                    $scope.answer2 = response.wrong2;
                    $scope.answer3 = response.answer;
                    $scope.answer4 = response.wrong3;
                break;
                case 4:
                    $scope.answer1 = response.wrong1;
                    $scope.answer2 = response.wrong2;
                    $scope.answer3 = response.wrong3;
                    $scope.answer4 = response.answer;
                break;
            }
            $scope.correctAnswer = correct;
        });
    };
};
