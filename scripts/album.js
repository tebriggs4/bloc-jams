// setSong function that takes one argument, songNumber, and assigns currentlyPlayingSongNumber
// and currentSongFromAlbum a new value based on the new song number
var setSong = function(songNumber) {
    //  If we click to play a different song before the current song is finished, we need to stop the current song before we set a new one.
    if (currentSoundFile) {
         currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // wrap an audio file in the buzz.sound constructor function. The function returns a Buzz sound object, which is instantiated
    // using the new keyword. It requires at least one argument, a link to an audio file (or array of audio files),
    // but also takes an optional settings object.
    // passed the audio file via the audioUrl property on the currentSongFromAlbum object
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // passed in a settings object that has two properties defined, formats and  preload. formats is an array of strings
         // with acceptable audio formats. We've only included the 'mp3' string because all of our songs are mp3s.
         // Setting the preload property to true tells Buzz that we want the mp3s loaded as soon as the page loads.
         formats: [ 'mp3' ],
         preload: true
    });
    
    setVolume(currentVolume);
};

var setVolume = function(volume) {      // function to set volume of song
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
};

// function takes one argument, number, and returns the song number element that corresponds to that song number
var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
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
         var songNumber = parseInt($(this).attr('data-song-number'));

	     if (currentlyPlayingSongNumber !== null) {
		    // Revert to song number for currently playing song because user started playing new song.
		    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
	     }
         
	     if (currentlyPlayingSongNumber !== songNumber) {
		    // Switch from Play -> Pause button to indicate new song is playing.
		    setSong(songNumber);       // update currentlyPlayingSongNumber and currentSongFromAlbum when a new song number is established
            currentSoundFile.play();   // play new song ****************
            $(this).html(pauseButtonTemplate);
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];  // ** this line was added in checkpoint 20, was in solution code
            updatePlayerBarSong();                                      // add a call when a new song is played
	     } else if (currentlyPlayingSongNumber === songNumber) {
		    // Switch from Pause -> Play button to pause currently playing song.
		    $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);  // revert the HTML of the element to the playerBarPlayButton
                                                                        // template when the song is paused
		    if (currentSoundFile.isPaused()) {
                // we need to start playing the song again and revert the icon in the song row and the player bar to the pause button
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                // we need to pause it and set the content of the song number cell and player bar's pause button back to the play button
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
	     }
     };
 
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
     };
    
     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
                        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
     };
    
     // The jQuery find() method is similar to querySelector(). We call it here to find the element with the .song-item-number
     // class that's contained in whichever row is clicked
     $row.find('.song-item-number').click(clickHandler); //Notice that clickHandler() no longer takes any arguments,
                                                         // which we'll address in our clickHandler() refactor.
     // The hover() event listener combines the mouseover and mouseleave functions we relied on previously.
     // The first argument is a callback that executes when the user mouses over the $row element and the second is a callback
     // executed when the mouse leaves $row.
     $row.hover(onHover, offHover);
     // we return $row, which is created with the event listeners attached
     return $row;
};

// set the current album
// create a function named setCurrentAlbum that the program calls when the window loads
var setCurrentAlbum = function(album) {
    currentAlbum = album; // assign the variable to album, the argument in the existing setCurrentAlbum() function
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

 // create a helper method with two arguments, album and song, that returns the index of a song found in album's songs array
 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 // When we call the next and previous functions in our application, they should increment or decrement the index
 // of the current song in the array, respectively.
 var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;  // if index=0 return last song in album, else return current song index
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {        // wrap to first song if the current song is the last song
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex+1);          // actual song number is index plus 1, set currentlyPlayingSongNumber and currentSongFronAlbum
    currentSoundFile.play();              // play current song
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);  // update HTML of new song's .song-item-number element with a pause button
    $lastSongNumberCell.html(lastSongNumber);       // update HTML of last song played element with the song number (was pause)
    
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;  // if index=last song then return 1 else return index+2
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;       // wrap to last song if the current song is the first song
    }
    // Set a new current song
    setSong(currentSongIndex+1);          // actual song number is index plus 1, set currentlyPlayingSongNumber and currentSongFronAlbum
    currentSoundFile.play();              // play current song

    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);  // update HTML of new song's .song-item-number element with a pause button
    $lastSongNumberCell.html(lastSongNumber);           // update HTML of last song played element with the song number (was pause)
        
};

 // update the text of the <h2> tags in album.html that contain the song name and the artist name.
 var updatePlayerBarSong = function () {
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);    // updates the HTML of the play/pause button
                                                                    // to the content of playerBarPauseButton
 }
 
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Add two new templates that hold the Ionicon for the play and pause button, so we can easily set the HTML
 // of the player bar when we've played a new song
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing albums
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;     // variable to store the number of the current song
 var currentSongFromAlbum = null;           // variable that will hold the currently playing song object from the songs array
 var currentSoundFile = null;               // variable to store the sound object when we set a new current song
 var currentVolume = 80;                    // variable to store current volume, initialize to 80

 // variables to hold jQuery selectors for the next and previous buttons
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);   // Add jQuery click event handlers to previous and next song buttons
     $nextButton.click(nextSong);
 });

