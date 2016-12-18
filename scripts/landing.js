var pointsArray = document.getElementsByClassName('point');
 
var revealPoint = function(point) {
    point.style.opacity = 1; /* The opacity will change from 0 to 1 */
    point.style.transform = "scaleX(1) translateY(0)"; /* transform property will scale the element from 90% to 100% of its width */
    point.style.msTransform = "scaleX(1) translateY(0)"; /* and translate it 3rem up to its normal position */
    point.style.WebkitTransform = "scaleX(1) translateY(0)";    
};

var animatePoints = function(points) {    
   forEach(points,revealPoint);  
};

/* property on the window object called onload that we can pass a function that executes
   when the window (like a browser window or tab) finishes loading */
window.onload = function() {
    if (window.innerHeight > 950) {
        /* automatically animate the points on a tall screen where scrolling can't trigger the animation */
        animatePoints(pointsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    /* assigns an array-like list of all elements that have the class name selling-points to the sellingPoints variable */
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200; /* set scroll distance */
    /* getBoundingClientRect() returns an object with four properties, top, left, right, and bottom. Each property measures the distance (in pixels) from the outside of a selected element to the end of the viewport (in this case, the window). */
    window.addEventListener('scroll', function(event) {
    /* call addEventListener() to add a listener to the window object, first argument is a string that represents the type of event
       for which the DOM should be listening, second is a callback function passed in as an event handler, which contains the code
       that executes when the event fires, event listeners provide the first argument to the handler function, event, sometimes
       abbreviated to e. event is a DOM object whose properties provide event dispatch information */
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
            /*  Let's trigger the animation when a user scrolls at least 200 pixels into the .selling-points element */
            animatePoints(pointsArray);   
        }
    });
}