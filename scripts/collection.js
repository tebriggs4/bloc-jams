var collectionItemTemplate =
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

window.onload = function() {
     // we select the first (and only, as we've designed it) element with an album-covers class name
     var collectionContainer = document.getElementsByClassName('album-covers')[0];
     // assign an empty string to collectionContainer's innerHTML property to clear its content
     collectionContainer.innerHTML = '';
 
     // inserts 12 albums using the += operator
     for (var i = 0; i < 12; i++) {
         collectionContainer.innerHTML += collectionItemTemplate;
     }
 }