/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    var mobile_threshold = 800;

    $(document).ready(function(){

        $(".post-content").fitVids();

        /* No effects on mobile. */
        if ($(window).width() > mobile_threshold) {
            $('#cover').parallax("50%", -0.3, true);
        }
    });

    /* No effects on mobile. */
    if ($(window).width() > mobile_threshold) {
        $(window).scroll(function() {
                var top = ($(window).scrollTop() > 0) ? $(window).scrollTop() : 1;
                $('.cover-content').css({opacity: 100 / top});
                $('.arrow').css({opacity: 100 / top});
        });
    }

    /* Scroll-down effect. */
    $('.arrow').click(function() {
        $('#start').ScrollTo({
            duration: 1000,
            easing: 'linear'
        });
    });

}(jQuery));
