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

// seek() uses the Buzz setTime() method to change the position in a song to a specified time
var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
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
            currentSoundFile.play();   // play new song
            updateSeekBarWhileSongPlays();
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];  // ** this line was added in checkpoint 20, was in solution code
             
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});  //  set the CSS of the volume seek bar to equal the currentVolume
            
            $(this).html(pauseButtonTemplate);
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
                updateSeekBarWhileSongPlays();
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

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // we bind() the timeupdate event to currentSoundFile. timeupdate is a custom Buzz event that fires
         // repeatedly while time elapses during song playback
         currentSoundFile.bind('timeupdate', function(event) {
             // we use a new method for calculating the seekBarFillRatio. We use Buzz's getTime() method to get the current time
             // of the song and the getDuration() method for getting the total length of the song. Both values return time in seconds.
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 // The function must take two arguments, one for the seek bar to alter (either the volume or audio playback controls) and one
 // for the ratio that will determine the  width and left values of the .fill and .thumb classes, respectively
 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;        // multiplying the ratio by 100 to determine a percentage
    
    offsetXPercent = Math.max(0, offsetXPercent);       // use Math.max() function to make sure our percentage isn't less than zero
    offsetXPercent = Math.min(100, offsetXPercent);     // use Math.min() function to make sure it doesn't exceed 100
 
    var percentageString = offsetXPercent + '%';        // convert our percentage to a string and add the % character
    // The ratio must be converted to a percentage so we can set the CSS property values as percents.
    // The percentage must be passed into jQuery functions that set the width and left CSS properties.
    // When we set the width of the .fill class and the left value of the .thumb class,
    // the CSS interprets the value as a percent instead of a unit-less number between 0 and 100
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 // a method for determining the seekBarFillRatio
 var setupSeekBars = function() {
     // Using jQuery to find all elements in the DOM with a class of "seek-bar" that are contained within the element with a class
     // of "player-bar". This will return a jQuery wrapped array containing both the song seek control and the volume control.
     var $seekBars = $('.player-bar .seek-bar');
     // Uses a click event to determine the fill width and thumb location of the seek bar.
     // Selecting either seek bar with our $seekBars selector. The seek bar that updates will be determined by the target of the event.
     $seekBars.click(function(event) {
         // pageX is a jQuery-specific event value, which holds the X coordinate at which the event occurred,
         // subtract the offset() of the seek bar held in $(this) from the left side, difference from event click location and the
         // start of the duration bar (or volume bar)
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // divide offsetX by the width of the entire bar to calculate seekBarFillRatio
         var seekBarFillRatio = offsetX / barWidth;
         
         if ($(this).parent().attr('class') == 'seek-control') {        // set position in song or volume depending on parent
            seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
            setVolume(seekBarFillRatio * 100);   
         }
 
         // pass $(this) as the $seekBar argument and seekBarFillRatio for its eponymous argument to updateSeekBarPercentage()
         updateSeekPercentage($(this), seekBarFillRatio);
     });
     // we find elements with a class of .thumb inside our $seekBars and add an event listener for the mousedown event.
     // A click event fires when a mouse is pressed and released quickly, but the mousedown event will fire as soon as the mouse button
     // is pressed down. jQuery allows us access to a shorthand method of attaching the mousedown event by calling mousedown
     // on a jQuery collection.
     $seekBars.find('.thumb').mousedown(function(event) {
         // taking the context of the event and wrapping it in jQuery, this will be equal to the .thumb node that was clicked.
         // This will be whichever seek bar this .thumb belongs to (song duration or volume control)
         var $seekBar = $(this).parent();
 
         // jQuery's bind() event is a new way to track events, we use bind() because it allows us to namespace event listeners,
         // the event handler inside the bind() call is identical to the click behavior.
         // We attached mousemove event to $(document) to make sure that we can drag the thumb after mousing down,
         // even when the mouse leaves the seek bar.
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($seekBar.parent().attr('class') == 'seek-control') {      // set position in song or volume depending on parent class
                seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                setVolume(seekBarFillRatio * 100);   
         }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // mouseup event fires when the mouse button is released
         // uses the unbind() event method, which removes the previous event listeners that we just added
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
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
    updateSeekBarWhileSongPlays();
    
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
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);  // update HTML of new song's .song-item-number element with a pause button
    $lastSongNumberCell.html(lastSongNumber);           // update HTML of last song played element with the song number (was pause)
        
};

var togglePlayFromPlayerBar = function() {
    // if a song is paused and the play button is clicked in the player bar, change song numbe cell from play to pause.
    // change HTML of player bar's button to pause and play the song.
    var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        songNumberCell.html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
    } else if (currentSoundFile) {
        // If the song is playing (so a current sound file exist), and the pause button is clicked in the player bar, change
        // the song number cell from pause to play button, change HTML of player bar's button to play and pause the song.
        songNumberCell.html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
    }
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
 var $playPauseButton = $('.main-controls .play-pause');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);   // Add jQuery click event handlers to previous and next song buttons
     $nextButton.click(nextSong);
     $playPauseButton.click(togglePlayFromPlayerBar);
 });

