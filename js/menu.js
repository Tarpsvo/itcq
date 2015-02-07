var menu = {
    hide: function (which) {
        switch (which) {
            case 'main':
                    $('.main')
                    .stop()
                    .animate({top: '-100px'}, 300, function() {$('.main').css('display', 'none');});
            break;

            case 'back':
                $('#back-button')
                .stop()
                .animate({top: '-100px'}, 300, function() {$('#back-button').css('display', 'none');});
            break;
        }
    },

    show: function (which) {
        switch (which) {
            case 'main':
                $('.main')
                .css('display', 'block')
                .stop()
                .animate({top: "0"}, 300);
            break;

            case 'back':
                $('#back-button')
                .css('display', 'block')
                .stop()
                .animate({top: "0"}, 300);
            break;
        }
    }
};