//Global Variables

var pattern = [];


function rand(){

  for (var pat = 0; pat < 8; pat++){
    pattern.push(Math.floor(Math.random()*4)+1)
  }
}

var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;




function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  // swap the Start and Stop buttons
  rand();
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
 
  // playSingleClue(4);
  playClueSequence();

  console.log("Start was clicked");
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  console.log("Stop was clicked");
}

//Sound Synthesis Functions
const freqMap = {
  1: 219.4,
  2: 329.6,
  3: 392,
  4: 466.2,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound

function playSingleClue(btn) {
  if (gamePlaying) {
   
    console.log(clueHoldTime);
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
    clueHoldTime = clueHoldTime-20;
  }
}

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

var guessCounter = 0;

function playClueSequence() {
  guessCounter = 0;
  // context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
  
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  // add game logic here

  if (pattern[guessCounter] === btn ) {
    //Guess was correct!
    if (guessCounter === progress) {
      if (progress === pattern.length - 1) {
        //GAME OVER: WIN!
        winGame();
      } else {
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    } else {
      //so far so good... check the next guess
      guessCounter++;
    }
  } else {

      loseGame();
    

    //Guess was incorrect
    //GAME OVER: LOSE!
  }
  
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.  \n Your Score is:" +progress);
 
}

function winGame() {
  stopGame();
  alert("Game Over. You Won. \n Your Score is:" +progress);
 
}
