const modelParams = {
    flipHorizontal: true, // flip e.g for video
    imageScaleFactor: 0.7, // reduce input image size for gains in speed.
    maxNumBoxes: 29, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.79, // confidence threshold for predictions.

}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;


const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');
// /home/edg3/web_dev/handtrack-js/index.html
const context = canvas.getContext('2d');
let model;

var A = new Audio("sound2.mp3");

function startAudio() {
    A.play();
}

function stopAudio() {
    A.pause();
    A.currentTime = 0;
}

document.onkeydown = function(e) {
    e = e || window.event;
    var key = e.which || e.keyCode;
    if (key === 65) {
        startAudio();
        console.log(key)
    }
};

document.onkeyup = function(e) {
    e = e || window.event;
    var key = e.which || e.keyCode;
    if (key === 65) {
        stopAudio();
    }

};


function muteOnFalse() {
    handTrack.startVideo(video)
        .then(status => {
            if (status) {
                navigator.getUserMedia({
                        video: {}
                    }, stream => {
                        video.srcObject = stream;
                        runDetectionMuteOnFalse();
                    },
                    err => console.log(err)
                );
            }
        });
}

function pauseOnFalse() {
    handTrack.startVideo(video)
        .then(status => {
            if (status) {
                navigator.getUserMedia({
                        video: {}
                    }, stream => {
                        video.srcObject = stream;
                        runDetectionPauseOnFalse();

                    },
                    err => console.log(err)
                );
            }
        });
}

function startOverOnTrue() {
    handTrack.startVideo(video)
        .then(status => {
            if (status) {
                navigator.getUserMedia({
                        video: {}
                    }, stream => {
                        video.srcObject = stream;
                        runDetectionPauseOnFalse();

                    },
                    err => console.log(err)
                );
            }
        });
}


function runDetectionMuteOnFalse() {
    model.detect(video)
        .then(predictions => {
            console.log(predictions);
            model.renderPredictions(predictions, canvas, context, video);
            if (predictions.length > 0) {
                // startAudio();
                audio.volume = 1.0
                audio.play();
            } else {
                // stopAudio();
                audio.volume = 0.0;
            }
            requestAnimationFrame(runDetectionMuteOnFalse);
        });
}

function runDetectionPauseOnFalse() {
    model.detect(video)
        .then(predictions => {
            console.log(predictions);
            model.renderPredictions(predictions, canvas, context, video);
            if (predictions.length > 0) {
                audio.play();
            } else {
                // stopAudio();
                audio.pause();
            }
            requestAnimationFrame(runDetectionPauseOnFalse);
        });
}

function runDetectionStartOver() {
    model.detect(video)
        .then(predictions => {
            console.log(predictions);
            model.renderPredictions(predictions, canvas, context, video);
            if (predictions.length > 0) {
                // audio.start();
                startAudio();
            } else {
                stopAudio();
                // audio.currentTime = 0.0;
            }
            requestAnimationFrame(runDetectionStartOver);
        });
}


handTrack.load(modelParams)
    .then(lmodel => {
        model = lmodel;
    });
