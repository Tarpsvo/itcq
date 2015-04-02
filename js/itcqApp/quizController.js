(function() {
    'use strict';

    angular
        .module('itcqApp')
        .controller('QuizController', QuizController);

    function QuizController($scope, $cookieStore, questionFactory, dataService) {
        var correctAnswers = 0;
        var requiredAnswers = 0;
        $scope.quizLevel = (!$cookieStore.get('quizLevel')) ? 1 : $cookieStore.get('quizLevel');
        $scope.imageId = 'default';

        /* Checks if pressed button has the correct answer ID and adds correctAnswer and wrong to the scope */
        $scope.checkAnswer = function(number, answer) {
            var answer_correct = Boolean(number == $scope.correctAnswer);
            $scope.answerChosen = true;

            if (answer_correct) {
                $scope.correct = $scope.correctAnswer;
                correctAnswers++;
            } else {
                $scope.wrong = number;
                $scope.correct = $scope.correctAnswer;
            }

            this.checkProgress();

            /* Write the answer to the statistics table */
            var jsonData = {'questionId': $scope.questionId, 'answer_correct': answer_correct, 'answer': answer};
            dataService.postData('logQuestionAnswer', jsonData, false);
        };

        $scope.checkProgress = function() {
            requiredAnswers = $scope.quizLevel * 4;
            $scope.progressWidth = (correctAnswers / requiredAnswers)*100;

            if ($scope.progressWidth >= 100) {
                dataService.throwSuccess("Level up");
                $scope.quizLevel++;
                correctAnswers = 0;
                $scope.progressWidth = 0;
                $scope.saveProgress();
            }
        };

        $scope.saveProgress = function() {
                $cookieStore.put('quizLevel', $scope.quizLevel);
        };

        /* Loads the next question and passes it to the scope */
        $scope.nextQuestion = function() {
            $scope.answerChosen = false;
            $scope.correct = null;
            $scope.wrong = null;

            questionFactory.getQuestion().then(function (response) {
                $scope.question = response.question;
                $scope.questionId = response.id;
                var correct = Math.floor((Math.random() * 4) + 1); // Random between 1-4

                console.log(response);
                if (response.has_image == 1) $('#quiz-image').css('background-image', "url('../img/questions/"+response.id+".jpg')");

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
    }
})();
