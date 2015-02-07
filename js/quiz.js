var quiz = {
    answer: null,
    question: null,


    loadQuestion: function() {
        var question = {
            question: "This is the question?",
            answer1: "Answer one",
            answer2: "Answer two",
            answer3: "Answer three",
            answer4: "Answer four",
            correct: 3
        };

        this.question = question;
        this.answer = question.correct;

        return true;
    },

    displayQuestion: function() {
        var quizTemplate =
                    "<div id='quiz-content'>"+
                        "<h3 id='quiz-question'>"+this.question.question+"</h3>"+
                        "<div id='quiz-answers'>"+
                            "<a href='#answer-1' id='quiz-answer-1' class='answer box-shadow'>"+this.question.answer1+"</a>"+
                            "<a href='#answer-2' id='quiz-answer-2' class='answer box-shadow'>"+this.question.answer2+"</a>"+
                            "<a href='#answer-3' id='quiz-answer-3' class='answer box-shadow'>"+this.question.answer3+"</a>"+
                            "<a href='#answer-4' id='quiz-answer-4' class='answer box-shadow'>"+this.question.answer4+"</a>"+
                        "</div>"+
                    "</div>";

        $('#dynamic-content').html(quizTemplate);
        
    }



};