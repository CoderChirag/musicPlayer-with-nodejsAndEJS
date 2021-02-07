//-------------------//------------------------//-----Likes Section-----//------------------------//--------------//

// Like Feature - We can Like or Dislike Any Song Now, You can Test it.
hearts = document.getElementsByClassName("fa-heart");
for (let i=0; i<hearts.length; i++){
    hearts[i].addEventListener("click", () => {
        if (hearts[i].style.color == 'red'){
            hearts[i].style.color = 'transparent';
        }
        else{
            hearts[i].style.color = 'red';
        }
    });
}

//-------------------//------------------------//---Functions Section---//------------------------//--------------//

// Declaring all globals needed for player functionality
var audio, duration, interval;

var isPlaying = 'notStarted';
// Function for creating New Audio Object
function newAudio(song){
    console.log(song);
    audio = new Audio(song);
    // Getting the Duration of the Song and displaying it on the player
    audio.addEventListener('loadedmetadata', function(){
        duration =  Math.round(audio.duration);
        var minutes = Math.floor(duration/60);
        var seconds = duration%60;
        if (seconds<10){
            document.getElementById("duration").innerHTML = `${minutes} :0${seconds.toPrecision(1)}`;
        }
        else{
            document.getElementById("duration").innerHTML = `${minutes}:${seconds.toPrecision(2)}`;
        }
    });
    // Callback to Play Function
    play();
}

// Play Function
function play(){
    isPlaying = 'playing';
    // Changing the Play Button to Pause Button because now the Song will be played and now user wolud want to pause it instead of playing it again
    document.getElementById("play-btn").classList.remove("fa-play");
    document.getElementById("play-btn").classList.add("fa-pause");
    document.getElementById("play-btn").style.marginLeft = '0px';
    // Playing the audio object created above
    audio.play();
    // Getting the current duration of song and getting it displayed after each second
    // Also here we are moving the progress bar also
    interval = setInterval(function(){
        let currentTime = Math.round(audio.currentTime) 
        let minutes = Math.floor(currentTime/60);
        let seconds = currentTime%60;
        // Updating the current time each second
        if (seconds<10){
            document.getElementById("current-time").innerHTML = minutes + ":0" + seconds.toPrecision(1);
        }
        else{
            document.getElementById("current-time").innerHTML = minutes + ":" + seconds.toPrecision(2);
        }
        // Updating the progress bar each second
        // I am using this just for increasing the speed of updation of width
        // Here I will not round the current time and thus the time would be very accurate and thus it woul be updated very fast
        let currentTimeAccurate = audio.currentTime;
        document.getElementById("progress").style.width = (currentTimeAccurate/duration)*100 + "%";
        document.getElementById("progress-tip").style.marginLeft = ((currentTimeAccurate/duration)*100)-1.5 + "%";
    }, 100);
}

// Pause Function
function pause(){
    isPlaying = 'paused';
    // Changing the Pause Button to Play Button because now the song will be paused and the user would want to play it instead of pausing again
    document.getElementById("play-btn").classList.remove("fa-pause");
    document.getElementById("play-btn").classList.add("fa-play");
    document.getElementById("play-btn").style.marginLeft = '2px';
    // Stoping the updataion of the current duration after pausing the song so that computer memory dont get wasted
    clearInterval(interval)
    // Pausing the audo Object created above
    audio.pause();
}

// Stop Function
function stop(){
    // If the song is previously playing then there would be the pause button on the screen
    // Now our work is to change that pause button to the play button and then pause the song and then set the Current Time of the song to 00:00 second. This task would act like that we have stopped the current song.
    if (isPlaying == 'playing'){
        document.getElementById("play-btn").classList.remove("fa-pause");
        document.getElementById("play-btn").classList.add("fa-play");
        document.getElementById("play-btn").style.marginLeft = '2px';
        audio.pause();
        audio.currentTime = 0;
    }
    // Now, if the song is previously paused, then there would already be a play button on the screen, therefore, no need to change the icon.
    // In this case, we have to simply pause the song and set its current time to 00:00.
    else if (isPlaying == 'paused'){
    audio.pause();
    audio.currentTime = 0;
    }
    isPlaying = 'notStarted';
}

// Function for setting progress of song on click or on dragging

// Global variable for this functionality
var pageXOffset;

function setProgress(xPos, playerWidth) {
    // This is the location of click from Left of the player div In Percentage 
    const xPosPercent = (xPos/playerWidth)*100;
    // Now changing the Left Margin of Progress Tip and width of Song Progress According to the percentage
    document.getElementById("progress-tip").style.marginLeft = xPosPercent + "%";
    document.getElementById("progress").style.width = (xPosPercent+1.5) + "%";
    // Now Changing the current time of the song
    const currentTime = (xPosPercent/100)*duration;
    audio.currentTime = currentTime;
}

// Function for starting of drag event, here we have to check that the target which the user is dragging is Progress-tip and if it is so then set active to true, which means that drag event has started
// Also the current time of the song would be changed only if any song is in Playing State or in Paused State, but it should not be in notStarted State
function dragStart(e) {
    if (isPlaying != "notStarted"){
        if (e.target === dragItem) {
            active = true;
        }
    }
}

// Function which will be executed during the dragging is going on
function drag(e) {
    if (active) {
        // As by default, the divs has a nature of preventing the events like drag, therefore, we use preventDefault() method to prevent their default nature of preventing the drag to occur
        e.preventDefault();
        // Finding the X- coordinate of the current drag
        if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - (rect.left + pageXOffset);
        } else {
        currentX = e.clientX - (rect.left + pageXOffset);
        }
        // Setting the progress of current song according to the current X-coordinate
        setProgress(currentX, playerWidth);
    }
}

// Function for ending the drag
function dragEnd(e) {
    // At the time of ending the drag, we set active to false which indicates that drag is now over
    active = false;
}

//-------------------//------------------------//--Driver Code Section--//------------------------//--------------//



// Playing and Pausing a song
// Checking wether we have to Playe the song or Pause the song or Resume the song
document.getElementById("play-btn").addEventListener("click", function(){
    // If the song has not started yet, then we first have to create a new Audio Object, and then play the song
    if (isPlaying == 'notStarted'){
        newAudio('audio/jeenaJeena.mp3');
    }
    // If the song is playing before, then we have to pause it
    else if (isPlaying == 'playing'){
        pause();
    }
    // If the song is paused previously, then we have to Resume the song
    else if (isPlaying == 'paused'){
        play();
    }
});

// For Replaying the song
document.getElementById("replay").addEventListener("click", () => {
    // For replaying first we have to stop the song which will also destroy the previous audio object, so now after stopping the song we have to create a new Audio Object and then play the song again.
    stop();
    newAudio(currentSong);
});

// For Changing The Songs
// There are currently only 3 songs which we can change by going to playlist section and clicking on the play button
// Our task is to listen the click event and detect which song was clicked and then stop the song playing currently and then update the bottom navbar according to the clicked song and then start playing it.

// Current Playing  Song
var currentSong = "audio/jeenaJeena.mp3";
var currentSongInfo = ['images/jeenaJeena.jpg', 'Jeena Jeena', 'Atif Aslam'];
// Listening to the event
var allSongs = document.getElementsByClassName("songs-img-play");
for (var i=0; i<allSongs.length; i++){
    allSongs[i].addEventListener("click", e => {
        // Stopping the previously playing song
        stop();
        // Checking which song is clicked
        if ('mirage' == e.path[0].classList[(e.path[0].classList.length)-1]){
            console.log("Mirage");
            // Changing the Song
            currentSong = "audio/mirage.mp3";
            currentSongInfo[0] = 'images/mirage.jpg';
            currentSongInfo[1] = 'Mirage';
            currentSongInfo[2] = 'Dino James';
            newAudio(currentSong); 
        }
        else if ('jeenaJeena' == e.path[0].classList[(e.path[0].classList.length)-1]){
            console.log("Jeena Jeena");
            // Changing the Song
            currentSong = "audio/jeenaJeena.mp3";
            currentSongInfo[0] = 'images/jeenaJeena.jpg';
            currentSongInfo[1] = 'Jeena Jeena';
            currentSongInfo[2] = 'Atif Aslam'
            newAudio(currentSong);
        }
        else if('kaunTuzhe' == e.path[0].classList[(e.path[0].classList.length)-1]){
            console.log('Kaun Tuzhe');
            // Changing the Song
            currentSong = "audio/kaunTuzhe.mp3";
            currentSongInfo[0] = 'images/kaunTuzhe.jfif';
            currentSongInfo[1] = 'Kaun Tuzhe';
            currentSongInfo[2] = 'Palak Muchhal';
            newAudio(currentSong);
        }
        // Changing all the information according to the new song
         document.getElementById("bottom-img").src = currentSongInfo[0];
         document.getElementById("bottom-song").innerHTML = currentSongInfo[1];
         document.getElementById("bottom-singer").innerHTML = currentSongInfo[2];
    });
}
var songs = document.getElementsByClassName("search-song-play")
for (let song of songs){
    song.addEventListener("click", (e) => {
        console.log("event triggered");
        // Stopping the previously playing song
        stop();
        // Checking which song is clicked and getting its link
        function songInfo(data){
            console.log(data);
            currentSong = data.trackUrl;
            currentSongInfo[0] = data.imgUrl;
            currentSongInfo[1] = data.trackName;
            currentSongInfo[2] = data.artistName;
            newAudio(currentSong);

            // Changing all the information according to the new song
            document.getElementById("bottom-img").src = currentSongInfo[0];
            document.getElementById("bottom-song").innerHTML = currentSongInfo[1];
            document.getElementById("bottom-singer").innerHTML = currentSongInfo[2];
        }
        var id = song.id;
        fetchSong = fetch(`songURL/${id}`)
        .then(res=>res.json())
        .then(data=>songInfo(data));
    })
}

// Changing the current time of song by clicking anywhere on the player
document.getElementById("player-bar").addEventListener("click", (e) =>
{
    // The current time of the song would be changed only if any song is in Playing State or in Paused State, but it should not be in notStarted State
    if (isPlaying != "notStarted"){
        // These are the CoOrdinates of the player div inside which progress of our song is going on
        const rect = document.getElementById("player-bar").getBoundingClientRect();
        // This is the total width of the player div
        const playerWidth = rect.width;
        // This is the Xcoordinate of user click From Left Of The Player Div
        const clickLocation = e.clientX - (rect.left + pageXOffset);
        // Setting the progress of song in the song div according to the coordinate of click
        setProgress(clickLocation, playerWidth);
    }
});

// Changing the current time of song by dragging the Progress-Tip
// Defining the drag-container as Player-Div and drag-item as Progress-Tip
const dragItem = document.querySelector("#progress-tip");
const container = document.querySelector("#player-bar");
// These are the CoOrdinates of the player div inside which progress of our song is going on
const rect = container.getBoundingClientRect();
// This is the total width of the player div
const playerWidth = rect.width;
// This tells wether the drag event is active or not
var active = false;
// Adding event Listeners 
// We have to add event listeners for touch screen and mouse based screen separately
// Event listeners for a touchscreen
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);
// Event listeners for mousedown, mouseup and mousemove for a mouse based screen
container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

// Disabling the Inspect Mode in the Browser
document.addEventListener("keydown", function(e){
    if(e.keyCode == 123) {
      console.log('You cannot inspect Element');
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
      console.log('You cannot inspect Element');
      return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
      console.log('You cannot inspect Element');
      return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
      console.log('You cannot inspect Element');
      return false;
    }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
      console.log('You cannot inspect Element');
      return false;
    }
  }); 
  // prevents right clicking
  document.addEventListener('contextmenu', e => e.preventDefault());




