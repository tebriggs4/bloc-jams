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
 
     // We can attach event listeners to dynamically created elements before we add them to the DOM
     var $row = $(template);
     // As noted earlier, the clickHandler function will no longer need to take any arguments. We no longer need to
     // reference the targetElement or use the getSongItem() function because we can use this to reference the row
     var clickHandler = function() {
         var songNumber = $(this).attr('data-song-number');

	 if (currentlyPlayingSong !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
		currentlyPlayingCell.html(currentlyPlayingSong);
	 }
	 if (currentlyPlayingSong !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSong = songNumber;
	 } else if (currentlyPlayingSong === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
		currentlyPlayingSong = null;
	 }
     };
 
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
     };
     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
        }
     };
    
     // The jQuery find() method is similar to querySelector(). We call it here to find the element with the .song-item-number
     // class that's contained in whichever row is clicked
     $row.find('.song-item-number').click(clickHandler); //Notice that clickHandler() no longer takes any arguments,
                                                         // which we'll address in our clickHandler() refactor.
     // The hover() event listener at #2 combines the mouseover and mouseleave functions we relied on previously.
     // The first argument is a callback that executes when the user mouses over the $row element and the second is a callback
     // executed when the mouse leaves $row.
     $row.hover(onHover, offHover);
     // we return $row, which is created with the event listeners attached
     return $row;
};

// set the current album
// create a function named setCurrentAlbum that the program calls when the window loads
var setCurrentAlbum = function(album) {
    // select all HTML elements required to display on the album page
    // We replace each instance of getElementsByClassName with a jQuery selector and use CSS-style syntax to select the elements
    // we add a $ to the start of each variable name because they now reference jQuery objects
    // When a jQuery selector returns a single element, we can access it without array-index syntax. For example,
    // we can call a jQuery method directly on a selector without recovering the first (and only) item in the array.
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
    
     // assign values to each part of the album
     // We call jQuery's text() method to replace the content of the text nodes, instead of setting firstChild.nodeValue
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     // We also change the setAttribute() method to jQuery's attr() method, which changes the element attribute using the same arguments
     $albumImage.attr('src', album.albumArtUrl);
 
     // clear the album song list HTML to make sure there are no interfering elements with jQuery
     $albumSongList.empty();
 
     // build list of songs from album JavaScript object 
     // go through all the songs from the specified album object and insert them into the HTML using the innerHTML property
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };
 
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Store state of playing songs
 var currentlyPlayingSong = null;

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
 });

