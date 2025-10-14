// HTML Element References

const messageContainer = document.getElementById('message-container');
const timerMinutesOnes = document.getElementById('timer-minutes-ones');
const timerSecondsOnes = document.getElementById('timer-seconds-ones');
const timerSecondsTens = document.getElementById('timer-seconds-tens');

const room1 = document.getElementById('room1');
const room2 = document.getElementById('room2');
const room3 = document.getElementById('room3');
const room4 = document.getElementById('room4');
const room5 = document.getElementById('room5');
const room6 = document.getElementById('room6');
const room7 = document.getElementById('room7');
const room8 = document.getElementById('room8');
const room9 = document.getElementById('room9');

// Global Variable Initializations
let currentMessageId = 0;
let currentFugitiveRoomNumber = 4;
let currentDetectiveRoomNumber = 1;
let initialTimerTimeInTenthsOfSeconds = 130;
let timerTimeInTenthsOfSeconds = initialTimerTimeInTenthsOfSeconds;
let fugitiveMovementTimeInterval=0;
let fugitiveMovementTickAccumulator =0;
let numberOfRooms = 9;
let gameOver = false;

// Comments Data Structure

const messages = {
  fugitiveAlmostOut: "Ha! I'm going to escape!",
  randomTaunts: [
    "You'll never catch me.",
    'Better run faster, detective!',
    'Getting tired?',
  ],
  openingScript: [
    "I'm way ahead of you, detective.",
    "Just wait--I'll catch you!",
    "We'll see about that.",
  ],
};

// Characters Data Structure

const characters = [
  {
    name: 'Fugitive',
    portrait: 'fugitive-portrait.png',
  },
  {
    name: 'Detective',
    portrait: 'detective-portrait.png',
  },
];

// Generated Message Objects Data Structure

let generatedMessages = {};

// Message Element Class

class Message {
  constructor(character, text) {
    this.id = currentMessageId;
    this.character = character;
    this.text = text;
    this.el = document.createElement('div');
    this.create();
  }

  create() {
    currentMessageId++;

    messageContainer.appendChild(this.el).classList.add('message');

    const messageHeadingWrapper = document.createElement('div');
    this.el
      .appendChild(messageHeadingWrapper)
      .classList.add('message-heading-wrapper');

    const messageTextContainer = document.createElement('div');
    this.el
      .appendChild(messageTextContainer)
      .classList.add('message-text-container');

    const messagePortraitContainer = document.createElement('div');
    messageHeadingWrapper
      .appendChild(messagePortraitContainer)
      .classList.add('message-portrait-container');

    const messageNameContainer = document.createElement('div');
    messageHeadingWrapper
      .appendChild(messageNameContainer)
      .classList.add('message-name-container');

    const character = this.character;
    const characterListing = characters.find(c => c.name === character);

    messagePortraitContainer.style.backgroundImage = `url(${characterListing.portrait})`;
    // console.log(`${characterListing.portrait}`);

    messageNameContainer.textContent = character;

    messageTextContainer.textContent = this.text;

    generatedMessages[this.id] = this;
    // console.log(generatedMessages);
  }
}

// Messages Testing

new Message('Fugitive', messages.fugitiveAlmostOut);
new Message('Detective', 'I will catch you!');
new Message('Detective', 'This is getting difficult!');

// Timer Display Logic

function updateTimer() {

// HTML References Method (inferior)
// 
//  let secondsOnes = timerSecondsOnes.innerHTML;
//  let secondsTens = timerSecondsTens.innerHTML;
//  let minutesOnes = timerMinutesOnes.innerHTML;
//
//  if (secondsOnes > 0) {
//     secondsOnes--;
//   } else if (secondsOnes === 0) {
//     if (secondsTens > 0) {
//       secondsOnes = 9;
//       secondsTens--;
//     } else if (secondsTens === 0) {
//       if (minutesOnes === 0 && secondsTens === 0 && secondsOnes === 0) {
//         clearInterval(startTimer);
//       } else {
//         secondsTens = 5;
//         secondsOnes = 9;
//         minutesOnes--;
//       }
//     }
//   }

// Variable Reference Method (better)

  let secondsOnes = Math.floor((timerTimeInTenthsOfSeconds/10) % 10);
  let secondsTens = Math.floor(((timerTimeInTenthsOfSeconds/10) % 60) / 10);
  let minutesOnes = Math.floor((timerTimeInTenthsOfSeconds/10)/60);

  timerSecondsOnes.innerHTML = secondsOnes;
  timerSecondsTens.innerHTML = secondsTens;
  timerMinutesOnes.innerHTML = minutesOnes;

    if (timerTimeInTenthsOfSeconds > 0) {timerTimeInTenthsOfSeconds--;} else clearInterval(startTimer);
}

// Initializing functions

function calculateFugitiveMovementTimeInterval() {
    const currentRoomId = document.querySelector('.contains-fugitive').parentElement.id;
    const currentRoomNumber = parseInt(currentRoomId.replace('room', ''));

    const finalRoomNumber = numberOfRooms;

    const movesToExit = finalRoomNumber - currentRoomNumber + 1;

    fugitiveMovementTimeInterval = Math.floor(initialTimerTimeInTenthsOfSeconds/movesToExit);
    return fugitiveMovementTimeInterval;
}

// Move a Character Room Portrait

const moveCharacterRoomPortrait = function(character, destinationRoomNumber) {
    const roomPortraitElement = document.querySelector(`.contains-${character.toLowerCase()}`);
    // console.log(roomPortraitElement);
    roomPortraitElement?.parentElement?.removeChild(roomPortraitElement);
    // console.log(roomPortraitElement);
    document?.getElementById(`room${destinationRoomNumber}`)?.appendChild(roomPortraitElement);

    if (destinationRoomNumber > numberOfRooms) {
        roomPortraitElement.parentElement?.removeChild();
        clearInterval(startTimer);
    }
}

//  Automatically Update Fugitive Position

const updateFugitivePosition = function() {
    const tickLimit = fugitiveMovementTimeInterval;
    const currentRoomId = document?.querySelector('.contains-fugitive')?.parentElement.id;
    const currentRoomNumber = parseInt(currentRoomId?.replace('room', ''));
    const nextRoomNumber = currentRoomNumber + 1;
    console.log(currentRoomNumber);

    fugitiveMovementTickAccumulator++;

    if (fugitiveMovementTickAccumulator >= tickLimit) {
        moveCharacterRoomPortrait('Fugitive', nextRoomNumber);
        if (nextRoomNumber === 10) {
          gameOver = true;
      }
        fugitiveMovementTickAccumulator = 0;
    }

    if (gameOver === true) {
        return;
    }

   
}

// Update Detective Position

const updateDetectivePosition = function() {
    const currentRoomId = document.querySelector('.contains-detective')?.parentElement.id;
    const currentRoomNumber = parseInt(currentRoomId?.replace('room', ''));
    const nextRoomNumber = currentRoomNumber + 1;

    if(gameOver === true) {
        console.log(gameOver);
        return;
    }

    moveCharacterRoomPortrait('Detective', nextRoomNumber);

    if (nextRoomNumber === 10) {
      gameOver = true;
      console.log(gameOver);
      return;
  }

  console.log(gameOver);
}

// Detective Movement Event Listener (Enter Key Press)

document.addEventListener('keyup', updateDetectivePosition);

// Overall initialization function

function initialize() {
    calculateFugitiveMovementTimeInterval();
}

// Initialization function call

initialize();

// Timer Start

const startTimer = setInterval(() => {
    updateTimer(); 
    updateFugitivePosition();
}, 100);



