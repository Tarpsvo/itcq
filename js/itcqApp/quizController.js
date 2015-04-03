(function() {
    'use strict';

    angular
        .module('itcqApp')
        .controller('QuizController', QuizController);

    function QuizController($scope, $cookieStore, questionFactory, dataService) {
        var itcq_data = {'level': 1, 'numAnswers': 0, 'numCorrectAnswers': 0, 'lvlCorrect': 0, 'lvlRequired': 0};
        $scope.imageId = 'default';

        /* Checks if pressed button has the correct answer ID and adds correctAnswer and wrong to the scope */
        $scope.checkAnswer = function(number, answer) {
            var answer_correct = Boolean(number == $scope.correctAnswer);
            $scope.answerChosen = true;

            if (answer_correct) {
                $scope.correct = $scope.correctAnswer;
                itcq_data.lvlCorrect++;
                itcq_data.numCorrectAnswers++;
            } else {
                $scope.wrong = number;
                $scope.correct = $scope.correctAnswer;
            }

            checkProgress();

            /* Write the answer to the statistics table */
            var jsonData = {'questionId': $scope.questionId, 'answer_correct': answer_correct, 'answer': answer};
            dataService.postData('logQuestionAnswer', jsonData, false);
        };

        /* Is run with every answer press, used to change the progress bar and upgrade level when necessary */
        var checkProgress = function() {
            itcq_data.lvlRequired = itcq_data.level * 4;
            $scope.progressWidth = (itcq_data.lvlCorrect / itcq_data.lvlRequired)*100;
            itcq_data.numAnswers++;

            if ($scope.progressWidth >= 100) {
                dataService.throwSuccess("Level up");
                itcq_data.lvlCorrect = 0;
                $scope.progressWidth = 0;
                itcq_data.level++;
            }
            saveDataToCookie();
            $scope.quizLevel = itcq_data.level;
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

                if (response.has_image == 1) $('#quiz-image').css('background-image', "url('../img/questions/"+response.id+".jpg')");
                else $('#quiz-image').css('background-image', "url('../img/questions/default.jpg')");

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

        /* Loads info from the itcq_data cookie and puts it to the itcq_data var */
        var getDataFromCookie = function() {
                itcq_data.level = (!$cookieStore.get('itcq_data')) ? 1 : $cookieStore.get('itcq_data').level;
                itcq_data.numAnswers = (!$cookieStore.get('itcq_data')) ? 0 : $cookieStore.get('itcq_data').numAnswers;
                itcq_data.numCorrectAnswers = (!$cookieStore.get('itcq_data')) ? 0 : $cookieStore.get('itcq_data').numCorrectAnswers;
                itcq_data.lvlCorrect = (!$cookieStore.get('itcq_data')) ? 0 : $cookieStore.get('itcq_data').lvlCorrect;
                itcq_data.lvlRequired = (!$cookieStore.get('itcq_data')) ? 0 : $cookieStore.get('itcq_data').lvlRequired;
                $scope.quizLevel = itcq_data.level;
                $scope.progressWidth = (itcq_data.lvlCorrect / itcq_data.lvlRequired)*100;
        };

        /* Stores the itcq_data var into a cookie */
        var saveDataToCookie = function() {
            $cookieStore.put('itcq_data', itcq_data);
        };

        getDataFromCookie();
    }
})();
