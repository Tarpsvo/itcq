var content = {
    displayMain: function() {
        menu.hide('back');
        var content = 
                "<div id='intro-content'>"+
                    "<h1 id='itcq-title'>ITCQ</h1>"+
                    "<h2 id='itcq-subtitle'>The IT College Quiz</h2>"+
                    "<a href='#/quiz' id='itcq-start' class='box-shadow'>START</a>"+
                "</div>";
        $("#dynamic-content").html(content);
        menu.show('main');
    },

    displayQuiz: function() {
        if (quiz.loadQuestion()) {
            menu.hide('main');
            quiz.displayQuestion();
            menu.show('back');
        } else {
            alert("Error!");
        }
    }
};

$(document).on('click', '#itcq-start', content.displayQuiz);
$(document).on('click', '#back-button', content.displayMain);