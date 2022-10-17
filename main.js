let ytplayer = document.getElementById('ytplayer');
let urlInput = document.getElementById('onMenuClick');
const regex = /([a-zA-z]{5}:\/\/)(www\.youtube\.com\/)(watch\?v=)([a-zA-Z0-9_-]*)/;
let progress = document.getElementById('progress');
const menu = document.getElementById('Menu');
let container = document.getElementById('container');
const front = document.getElementById('front');
const back = document.getElementById('back');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
const volumeControl = document.getElementById('volume-control');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
let progressBar = document.getElementById('percent_play');
let interval;
let video;

/// search functionality
let apiKey = "AIzaSyBMbs2_ez34K0b8I7YNHSzZMUvzc4nW4GU";
let videoList = document.getElementById('videoList');

const lib = {
    displayTime: function () {
        let cMin = Math.floor(currentTime / 60);
        let cSec = Math.floor(currentTime % 60);
        cTime.innerHTML = `${cMin}:${cSec}`;
    }
}

let controls = document.querySelector("#player-controls");
let displayInner = document.querySelector("#display-inner");
controls.addEventListener("click", function (e) {
    e.stopPropagation();
});
displayInner.addEventListener("click", function (e) {
    e.stopPropagation();
});

let url;
let videoId;
let player;
urlInput.addEventListener("keypress", function (e) {
    if (e.keyCode == "13") {
        if (!videoList.childElementCount == 0) {
            clearVideoList();
            player.stopVideo();
        }
        let searchValue = urlInput.value;
        search(searchValue);
        urlInput.value = '';

        async function search(searchValue) {
            let ytResp = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${searchValue}&part=snippet&type=video&maxResults=10`);
            // console.log(ytResp);
            let data = await ytResp.json();
            let videos = data.items;
            videos.forEach((el, i) => {
                let divTag = document.createElement('li');
                divTag.classList.add('media');
                divTag.setAttribute('id', `${el.id.videoId}`)
                let markup = `<img src="${el.snippet.thumbnails.medium.url}" class="thumbnail">
                                <div class="media-body">
                                  <h5 class="title">${el.snippet.title}</h5>
                            </div>`

                divTag.innerHTML = markup;
                videoList.appendChild(divTag);

            });
            video = document.querySelectorAll('.media');
            video.forEach((el) => {
                el.addEventListener("click", (e) => {
                    videoId = el.id;
                    onInputActive(videoId);
                    videoList.style.display = "none";

                    let musicTitle = document.getElementById('music-title');
                    musicTitle.innerHTML = `${truncate(e.target.innerHTML, 20)}`;

                    function truncate(str, n) {
                        return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
                    }
                })
            })
        }
    }
});

// Load the IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.

function onYouTubePlayerAPIReady() {
    // console.log("player active");
}

menu.addEventListener("click", function (e) {
    let removePlayer = document.querySelector('iframe');
    if (menu.innerHTML == "MENU") {
        progress.style.display = "block";
        urlInput.style.display = "none";
        ytplayer.style.display = "block";
        menu.innerHTML = "SEARCH";
        removePlayer.style.display = "block";
        videoList.style.display = "none";

    } else if (menu.innerHTML == "SEARCH") {
        progress.style.display = "none";
        urlInput.style.display = "block";
        removePlayer.style.display = "none";
        menu.innerHTML = "MENU";
        videoList.style.display = "block";
    }
});

container.addEventListener("click", function (e) {
    if (front.style.transform == "rotateY(0deg)") {
        front.style.transform = "rotateY(-180deg)";
        back.style.transform = "rotateY(0deg)";
    } else {
        front.style.transform = "rotateY(0deg)";
        back.style.transform = "rotateY(180deg)";
    }
});

//functions
function onInputActive(videoId) {
    if (player) {
        player.destroy();
    }

    player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
            'rel': 1,
            'allowfullscreen': 1,
            'autohide': 1,
            'autoplay': 1,
            'disablekb': 0,
            'loop': 0,
            'controls': 0
        },
        events: {
            // 'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

}

const volSettings = document.querySelector("#volume-settings");
volSettings.addEventListener("dblclick", function () {
    if (volumeIcon.style.display == "block") {
        volumeIcon.style.display = "none";
        muteIcon.style.display = "block";
        player.mute();
    } else if (muteIcon.style.display == "block") {
        volumeIcon.style.display = "block";
        muteIcon.style.display = "none";
        player.unMute();
    }
});

// progress bar 
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {

        play.style.display = "none";
        pause.style.display = "block";
        menu.innerHTML = "SEARCH";
        progress.style.display = "block";
        urlInput.style.display = "none";

        play.addEventListener("click", function () {
            player.playVideo();
            play.style.display = "none";
            pause.style.display = "block";
        });

        pause.addEventListener("click", function () {
            player.pauseVideo();
            play.style.display = "block";
            pause.style.display = "none";
        });

        menu.addEventListener("click", () => {
            if (menu.innerHTML == "MENU") {
                player.pauseVideo();
            } else if (menu.innerHTML == "SEARCH") {
                player.playVideo();
            }
        });

        volumeIcon.addEventListener("click", function () {
            volumeControl.classList.toggle("volume-display");
        });

        progressBar.classList.contains("buffer-bar");
        progressBar.classList.remove("buffer-bar");
        progress.style.overflow = "visible";

        let totalDuration = player.getDuration();
        let getVolume = player.getVolume();
        let currentTime = player.getCurrentTime();
        let cTime = document.querySelector('.current-time');

        let maxDuration = document.querySelector('.max-duration');
        let minDuration = Math.floor(totalDuration / 60);
        let secDuration = Math.floor(totalDuration % 60);
        maxDuration.innerHTML = `${minDuration}:${secDuration}`;

        //music slider
        let clickWidht;

        interval = setInterval(function () {
            if (progress.dataset.isDown === "1") return;

            progress.addEventListener('mousedown', function () {
                progress.dataset.isDown = "1";
            });

            progress.addEventListener("mouseup", function () {
                progress.dataset.isDown = "0";
            })

            progress.addEventListener('mousemove', function (e) {
                if (progress.dataset.isDown === "1") {
                    progressBar.style.width = e.offsetX + 'px';
                    clickWidht = (e.offsetX / 200) * totalDuration;
                    let cMin = Math.floor(currentTime / 60);
                    let cSec = Math.floor(currentTime % 60);
                    if (cSec < 10) {
                        cTime.innerHTML = `${cMin}:0${cSec}`;
                    } else {
                        cTime.innerHTML = `${cMin}:${cSec}`;
                    }
                    currentTime = clickWidht;
                }
            });
            progress.addEventListener('click', function (e) {
                progressBar.style.width = e.offsetX + 'px';
                clickWidht = (e.offsetX / 200) * totalDuration;
                currentTime = clickWidht;
            });

            if (clickWidht != null) {
                currentTime = clickWidht;
                player.seekTo(currentTime, true);

                let cMin = Math.floor(currentTime / 60);
                let cSec = Math.floor(currentTime % 60);
                if (cSec < 10) {
                    cTime.innerHTML = `${cMin}:0${cSec}`;
                } else {
                    cTime.innerHTML = `${cMin}:${cSec}`;
                }

            } else {
                currentTime = player.getCurrentTime();

                let cMin = Math.floor(currentTime / 60);
                let cSec = Math.floor(currentTime % 60);
                if (cSec < 10) {
                    cTime.innerHTML = `${cMin}:0${cSec}`;
                } else {
                    cTime.innerHTML = `${cMin}:${cSec}`;
                }
            }

            let progress_time = (currentTime / totalDuration) * 100;
            progressBar.style.width = `${progress_time}%`;

            let progressBarInner = document.getElementById('progress-bar-inner');
            let progressBarInnerValue = player.getVideoLoadedFraction();
            progressBarInner.style.width = `${progressBarInnerValue * 100}%`;

            clickWidht = null;

            // volume slider
            let progressBarVolume = document.getElementById('progress-bar-volume');
            progressBarVolume.style.height = `${getVolume}%`;
            let progressAreaVolume = document.getElementById('progress-area-volume');

            let clickHeight;
            progressAreaVolume.addEventListener("click", (eventHeight) => {
                clickHeight = eventHeight.offsetY;
                progressBarVolume.style.height = `${clickHeight}%`;

                getVolume = clickHeight;
                player.setVolume(getVolume);
            });

            video.forEach((el) => {
                el.addEventListener("click", (e) => {
                    clearInterval(interval);
                    cTime.innerHTML = "0.00";
                    maxDuration.innerHTML = "0.00";
                    progressBar.style.width = `0%`;
                })
            })

        }, 1000);

        urlInput.addEventListener("keypress", function (e) {
            if (e.keyCode == "13") {
                clearInterval(interval);
                cTime.innerHTML = "0.00";
                maxDuration.innerHTML = "0.00";
                progressBar.style.width = `0%`;
            }
        });


    } else if (event.data == YT.PlayerState.BUFFERING) {
        progressBar.classList.add("buffer-bar");
        progress.style.overflow = "hidden";
    }

}

function clearVideoList() {
    var removeList = document.querySelector("ul");
    while (removeList.firstChild) {
        removeList.removeChild(removeList.lastChild);
    }
}
