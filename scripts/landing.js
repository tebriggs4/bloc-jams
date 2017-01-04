var revealPoint = function() {
    $(this).css({                              /* we use the jQuery css() method in place of the multiple style property instances */
        opacity: 1,                            /* The opacity will change from 0 to 1 */
        transform: 'scaleX(1) translateY(0)'   /* transform property will scale the element from 90% to 100% of its width */
    });                                        /* and translate it 3rem up to its normal position */
};

var animatePoints = function() {    
   $.each($('.point'), revealPoint);  /* $(this) references a different .point element each time jQuery executes the revealPoint() callback */
};

/* property on the window object called onload that we can pass a function that executes
   when the window (like a browser window or tab) finishes loading */
$(window).load(function() {     /* using jQuery, We've made the window object a jQuery object. We've also changed
                                   the onload property to the jQuery load() method, which takes a function as an argument.
                                   When the page loads, the function will execute. */
    if ($(window).height() > 950) { /* jQuery, can get or set height, since we pass no arguments to the function, we get the height. */
         animatePoints();           /* automatically animate the points on a tall screen where scrolling can't trigger the animation */
    }
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;  /* set scroll distance */
    /* We replace getBoundingClientRect() with jQuery's .offset() method. And remove var sellingPoints = document.getElementsByClassName... */
    /* Returns an object with four properties, top, left, right, and bottom. Each property measures the distance (in pixels) from the
       outside of a selected element to the end of the viewport (in this case, the window). */
    $(window).scroll(function(event) {
    /* replace addEventListener() to jQuery scroll() method, which takes a function as an argument. jQuery's scroll() "method" is still
       an event handler, second is a callback function passed in as an event handler, which contains the code that executes when the event fires */
        if ($(window).scrollTop() >= scrollDistance) {
             /*  Let's trigger the animation when a user scrolls at least 200 pixels into the .selling-points element. Replace
                document.documentElement.scrollTop || document.body.scrollTop with the jQuery equivalent of $(window).scrollTop().*/
             animatePoints();
            }
    });
});