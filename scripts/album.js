// Example Album - in real world would pull this from a database
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

// Assignment 11 - add new example album
var albumChristmas = {
     title: 'Christmas on the Prairie',
     artist: 'Various Artists',
     label: 'Sony',
     year: '2016',
     albumArtUrl: 'assets/images/album_covers/10.png',
     songs: [
         { title: 'Winter Wonderland', duration: '3:01' },
         { title: 'Jingle Bells', duration: '4:01' },
         { title: 'Country Christmas', duration: '2:21'},
         { title: 'The First Noel', duration: '3:14' },
         { title: 'Let it Snow', duration: '2:15'}
     ]
};

// generates song row content
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
};

// Select elements that we want to populate with the text dynamically
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

// set the current album
var setCurrentAlbum = function(album) {

     // Assign values to each part of the album
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // Clear contents of album song list
     albumSongList.innerHTML = '';
 
     // Build list of songs from album JavaScript object
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };
 
 window.onload = function() {
     setCurrentAlbum(albumPicasso);
     // Assignment 11 - add addEventListener to toggle between 3 albums
     var albumList = [albumPicasso, albumMarconi, albumChristmas];
     var index = 1;
     albumImage.addEventListener("click",function() {
         setCurrentAlbum(albumList[index]);
         index++;
         if (index == albumList.length) {
             index = 0;
         }
     })
 };
