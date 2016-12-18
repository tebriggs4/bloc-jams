// Example Album - in real world would pull this from a database
// create JavaScript objects to represent albums
var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
};
 
// Another Example Album
var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
};

// createSongRow function generates the song row content
// createSongRow function assigns our previously static song row template to a variable named template and returns it
// it will take one of our album objects as an argument and will utilize the object's stored information by injecting it into the template
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     // we need to store the number before the user gets a chance to mouse over the row
     // we could do this with JavaScript, but a simpler solution is to use HTML5 data attributes
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
};

// set the current album
// create a function named setCurrentAlbum that the program calls when the window loads
var setCurrentAlbum = function(album) {
    // select all HTML elements required to display on the album page
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    
     // assign values to each part of the album
     // the firstChild property identifies the first child node of an element, and nodeValue returns or sets the value of a node
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // clear the album song list HTML to make sure there are no interfering elements
     albumSongList.innerHTML = '';
 
     // build list of songs from album JavaScript object 
     // go through all the songs from the specified album object and insert them into the HTML using the innerHTML property
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };
 
 // find parent element by class name, function that keeps traversing the DOM upward until a parent with a specified class name is found
 var findParentByClassName = function(element, targetClass) {
     if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className !== null && currentParent.className != targetClass) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
     }
 };

 // get song item number
 // When we click to play, switch, or pause a song, we need to change the innerHTML of the element with the .song-item-number class.
 // There are four different relationships the clicked element can have to the .song-item-number table cell
 var getSongItem = function(element) {
     switch (element.className) {
         case 'album-view-song-item':
             return element.querySelector('.song-item-number');
         case 'song-item-title':
         case 'song-item-duration':
             return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
             // We use the querySelector() method because we only need to return a single element with the .song-item-number class
         case 'song-item-number':
             return element;
         case 'ion-play':
         case 'ion-pause':
         case 'album-song-button':
             return findParentByClassName(element, 'song-item-number');
         default:
             return;
     }
 };
 
 // Create a function called clickHandler() that takes one argument, targetElement
 var clickHandler = function(targetElement) {
     // Store the .song-item-number element, selected using the getSongItem function, in a variable
     var songItem = getSongItem(targetElement);
     if (currentlyPlayingSong === null) {
         // Create a conditional that checks if currentlyPlayingSong is null. If true, it should set the songItem's content
         // to the pause button and set currentlyPlayingSong to the new song's number
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         // Add another conditional to revert the button back to a play button if the playing song is clicked again
         // Set currentlyPlayingSong to null after
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
      } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         // If the clicked song is not the active song, set the content of the new song to the pause button
         // We use the querySelector() method because we only need to return a single element
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };

 // Elements to which we'll be adding listeners
 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 // we want to attach event listeners to each table row (songRows variable) (instead of using event delegation)
 // because the action of leaving a cell is not something that can be specified as easily by listening on the parent
 // We will select an array of every table row and loop over each to add its event listener with for statement below
 var songRows = document.getElementsByClassName('album-view-song-item');
 // album button templates for play and pause
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Store state of playing songs
 var currentlyPlayingSong = null;

 window.onload = function() {
     setCurrentAlbum(albumPicasso);
     songListContainer.addEventListener('mouseover', function(event) {
         // Only target individual song rows during event delegation
         if (event.target.parentElement.className === 'album-view-song-item') {
             // We use the parentElement and className properties together to make sure that we only act on the table row
             // Select the .song-item-number element relative to the parent (that is, the table we're mousing-over)
             var songItem = getSongItem(event.target);
             
             if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                 // Change the content from the number to the play button's HTML
                 songItem.innerHTML = playButtonTemplate;
            }
         }
     });
     // We will select an array of every table row and loop over each to add its event listener
     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             // Cached song item
             var songItem = getSongItem(event.target);
             // The getAttribute() method takes a single argument: a string with the name of the attribute whose value we want to retrieve.
             // When the mouse leaves a selected table row, it will change back to the song number using the value obtained from this method
             var songItemNumber = songItem.getAttribute('data-song-number');
 
             // If item mouseleaving is not current song then make box show song number
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });
         // To register the click that will eventually change the value of currentlyPlayingSong, add an event listener for the click event
         // in the same for loop we created for the mouseleave event
         songRows[i].addEventListener('click', function(event) {
             // Finally, add the click handler to the event listener
             clickHandler(event.target);
         });
    }
 };

