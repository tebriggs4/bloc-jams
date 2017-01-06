// Example Album - in real world would pull this from a database
// create JavaScript objects to represent albums
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    // Add an audioUrl property to each song in the songs array of albumPicasso, and set the value to the corresponding path of the mp3.
    // Note that we don't add the .mp3 extension to the end of the audio files. We'll specify the file type when we use the files with Buzz.
    songs: [
        { title: 'Blue', duration: '4:26', audioUrl: 'assets/music/blue' },
        { title: 'Green', duration: '3:14', audioUrl: 'assets/music/green' },
        { title: 'Red', duration: '5:01', audioUrl: 'assets/music/red' },
        { title: 'Pink', duration: '3:21', audioUrl: 'assets/music/pink' },
        { title: 'Magenta', duration: '2:15', audioUrl: 'assets/music/magenta' }
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
        { title: 'Fits in your pocket', duration: '3:21' },
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15' }
    ]
};