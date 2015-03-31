(function() {
    'use strict';

    angular
        .module('itcqApp')
        .factory('questionFactory', questionFactory);

    function questionFactory(dataService) {
        return {
            /* Loads new question from the API */
            getQuestion: function() {
                return dataService.getData('question').then(function(response) {
                    var qst = response.data;

                    var question = {
                        'id': qst.id,
                        'question': qst.question,
                        'answer': qst.answer,
                        'wrong1': qst.wrong1,
                        'wrong2': qst.wrong2,
                        'wrong3': qst.wrong3
                    };

                    console.log("questionFactory: question queried, returned question with ID "+question.id);
                    return question;
                });
            }
        };
    }
})();
