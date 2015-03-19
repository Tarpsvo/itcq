angular
    .module('itcqApp')
    .factory('questionFactory', questionFactory);

function questionFactory(dataService) {
    return {
        /* Loads new question from the API */
        getQuestion: function() {
            return dataService.getData('qst').then(function(response) {
                qst = response.data;

                question = {
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
