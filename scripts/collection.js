var buildCollectionItemTemplate = function() { // jQuery, change name of variable that stores template from collectionItemTemplate to template
    // We wrap the template in a function. This function returns the markup string as a jQuery object, which we'll call a jQuery template.
    // Note that when naming action-oriented functions, it's a convention to start the function name with a verb
    var template =
     '<div class="collection-album-container column fourth">'           // column & fourth classes added so each album is 25% of container
   + '  <img src="assets/images/album_covers/01.png"/>'                 // build javascript templates with a string
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-name" href="album.html"> The Colors </a>'
   + '      <br/>'                                                      // line break
   + '      <a href="album.html"> Pablo Picasso </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;
 
    // Although we don't use any jQuery methods, we may later. To support that, we wrap template in a jQuery object to future-proof it
    return $(template);
};
$(window).load(function() {
     // we select the first (and only, as we've designed it) element with an album-covers class name
     // we substitute DOM selection with the shorter jQuery alternative. When the element selection becomes a jQuery object,
     // we prefix the collectionContainer variable name with a $, a convention that identifies jQuery-related variables.
     var $collectionContainer = $('.album-covers');
     // assign an empty string to collectionContainer's innerHTML property to clear its content
     // we replace the vanilla DOM scripting innerHTML property with the jQuery empty() method. The empty() method, like many
     // jQuery operations, is literal in what it does – it empties or removes any text or other elements from the element(s) it is called on
     $collectionContainer.empty();
 
     // inserts 12 albums using the += operator
     for (var i = 0; i < 12; i++) {
         var $newThumbnail = buildCollectionItemTemplate();
         // we replace += in the for loop with the append() method. With each loop, we append the template content to the collection container
         $collectionContainer.append($newThumbnail);
     }
 });