$(document).ready(function(){
    var onMain = true; // Helpful boolean to describe my current location on the website


    $('.change-content').click(function() {
        if (onMain) {
            onMain = false; // I am no longer on the main page
            $('.main')
                .stop()
                .animate({top: "-100px"}, 500, function() {
                    $('.main').css('display', 'none'); // Hide the main buttons

                    // Bring the back button down
                    $('#back-button')
                    .css('display', 'block')
                    .animate({top: '0'}, 300);
                });
        } else {
            onMain = true; // Back on the front page
            $('#back-button')
                .stop()
                .animate({top: "-100px"}, 500, function() {
                    $('#back-button').css('display', 'none'); // Hide the back button

                    // Bring the main buttons down
                    $('.main')
                    .css('display', 'block')
                    .animate({top: '0'}, 300);
                });
        }

    });
});