// HTML Element References

const topWrapper = document.getElementById('top-wrapper');
const bottomWrapper = document.getElementById('bottom-wrapper');

const messageContainer = document.getElementById('message-container');
const mapContainer = document.getElementById('map-container');
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

const detective = document.getElementById('detective');
const fugitive = document.getElementById('fugitive');

// Comments Data Structure

const messages = {
  fugitiveAlmostOut: "Ha! I'm going to escape!",
  taunts: [
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

const characters = {
  'fugitive': {
    name: 'Fugitive',
    portrait: 'fugitive-portrait.png',
    element: '',
    startingRoomNumber: 4,
    currentRoomNumber: 4,
  },
  'detective': {
    name: 'Detective',
    portrait: 'detective-portrait.png',
    element: '',
    startingRoomNumber: 1,
    currentRoomNumber: 1,
  },
};

console.log(characters['detective']);

// Generated Message Objects Data Structure

let generatedMessages = {};

// Global Variable Initializations

let currentMessageId = 0;
let initialTimerTimeInTenthsOfSeconds = 130;
let timerTimeInTenthsOfSeconds = initialTimerTimeInTenthsOfSeconds;
let fugitiveMovementTimeInterval=0;
let fugitiveMovementTickAccumulator =0;
let numberOfRooms = 9;
let gameOver = false;
let chatModeOpen = false;

// Message Element Class

class Message {
  constructor(characterObject, text) {
    this.id = currentMessageId;
    this.characterObject = characterObject;
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

    messagePortraitContainer.style.backgroundImage = `url(${this.characterObject.portrait})`;
    // console.log(`${characterListing.portrait}`);

    messageNameContainer.textContent = this.characterObject.name;

    messageTextContainer.textContent = this.text;

    generatedMessages[this.id] = this;
    // console.log(generatedMessages);

    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

// Messages Testing

new Message(characters.fugitive, messages.fugitiveAlmostOut);
new Message(characters.detective, 'I will catch you!');
new Message(characters.detective, 'This is getting difficult!');

// Timer Display Logic

function updateTimer() {

// Variable Reference Method

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
    const currentRoomId = `room${characters.fugitive.currentRoomNumber}`;
    const currentRoomNumber = parseInt(currentRoomId.replace('room', ''));

    const finalRoomNumber = numberOfRooms;

    const movesToExit = finalRoomNumber - currentRoomNumber + 1;

    fugitiveMovementTimeInterval = Math.floor(initialTimerTimeInTenthsOfSeconds/movesToExit);
    return fugitiveMovementTimeInterval;
}

function generateCharacterElements() {

  const parent = mapContainer;

  Object.values(characters).forEach(character => {
    
    const el = document.createElement('div');
    el.id = character.name.toLowerCase();
    el.classList.add('room-portrait');

    const room = document.getElementById(`room${character.startingRoomNumber}`);

    const parentRect = parent.getBoundingClientRect();
    const roomRect = room.getBoundingClientRect();

    const left = (roomRect.x - parentRect.x) + (0.5*roomRect.width);
    const top  = (roomRect.y  - parentRect.y)  + (0.5*roomRect.height);

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    mapContainer.appendChild(el);

    character.element = el;
  });
}

// Move a Character Room Portrait

const moveCharacterRoomPortrait = function(character=String) {

  // Translation Method

    const el = document.getElementById(character);
    const currentRoom = document.getElementById(`room${characters[character].currentRoomNumber}`);
    const targetRoom = document.getElementById(`room${characters[character].currentRoomNumber + 1}`);
    
   
    const currentRoomLeft = currentRoom?.getBoundingClientRect().left;
    const currentRoomTop = currentRoom?.getBoundingClientRect().top;
    const targetRoomLeft = targetRoom?.getBoundingClientRect().left;
    const targetRoomTop = targetRoom?.getBoundingClientRect().top;

    const shiftX = targetRoomLeft - currentRoomLeft;
    const shiftY = targetRoomTop - currentRoomTop;

    if (character === 'fugitive' && characters[character].currentRoomNumber === 9) {
      el.style.transform = 'translate(-50%, -150vh)';
      characters[character].currentRoomNumber++;
      return
    }

    el.style.left = parseInt(el.style.left) + shiftX + 'px';
    el.style.top = parseInt(el.style.top) + shiftY + 'px';

    characters[character].currentRoomNumber++;

    // Multiple portraits in a room => offset x
    fitMultipleRoomPortraits(character);
    // const otherCharacter = character === 'detective' ? 'fugitive' : 'detective';
    
    // const nudgeX = 55;

    // if (characters[character].currentRoomNumber === characters[otherCharacter].currentRoomNumber) {
    //   el.style.left = (parseInt(el.style.left) - nudgeX) + 'px';
    //   characters[otherCharacter].element.style.left = (parseInt(characters[otherCharacter].element.style.left) + nudgeX) + 'px';
    // }

}

function fitMultipleRoomPortraits(movingCharacter) {
  
  const otherCharacter = movingCharacter === 'detective' ? 'fugitive' : 'detective';
    
  const nudgeX = 55;

  if (characters[movingCharacter].currentRoomNumber === characters[otherCharacter].currentRoomNumber) {
    document.getElementById(`${movingCharacter}`).style.left = (parseInt(document.getElementById(`${movingCharacter}`).style.left) - nudgeX) + 'px';
    characters[otherCharacter].element.style.left = (parseInt(characters[otherCharacter].element.style.left) + nudgeX) + 'px';
  }
}

function recenterRoomPortraits() {

  if (characters.fugitive.currentRoomNumber >= 10) {
  
  const room = document.getElementById(`room${characters.detective.currentRoomNumber}`);
  const parent = mapContainer;
  const portrait = document.getElementById(characters.detective.name.toLowerCase());

  const parentLeft = parent.getBoundingClientRect().left;
  const parentTop = parent.getBoundingClientRect().top;

  const targetLeft = room.getBoundingClientRect().left;
  const targetTop = room.getBoundingClientRect().top;

  const newLeft = parseInt(targetLeft) - parseInt(parentLeft) + 0.5*room.getBoundingClientRect().width;
  const newTop = parseInt(targetTop) - parseInt(parentTop) + 0.5*room.getBoundingClientRect().height;

  portrait.style.left = `${newLeft}px`;
  portrait.style.top = `${newTop}px`;

  console.log('Recentering function has run')
  } else {

  Object.values(characters).forEach ( (character) => {

  const room = document.getElementById(`room${character.currentRoomNumber}`);
  const parent = mapContainer;
  const portrait = document.getElementById(character.name.toLowerCase());

  const parentLeft = parent.getBoundingClientRect().left;
  const parentTop = parent.getBoundingClientRect().top; 

  const targetLeft = room.getBoundingClientRect().left;
  const targetTop = room.getBoundingClientRect().top;

  const newLeft = parseInt(targetLeft) - parseInt(parentLeft) + 0.5*room.getBoundingClientRect().width;
  const newTop = parseInt(targetTop) - parseInt(parentTop) + 0.5*room.getBoundingClientRect().height;

  portrait.style.left = `${newLeft}px`;
  portrait.style.top = `${newTop}px`;

  console.log('Recentering function has run')
  
    });
  }

  if (characters.detective.currentRoomNumber === characters.fugitive.currentRoomNumber) {
    fitMultipleRoomPortraits('detective');
  }
}

//  Automatically Update Fugitive Position

const updateFugitivePosition = function() {
    const tickLimit = fugitiveMovementTimeInterval;

    fugitiveMovementTickAccumulator++;

    if (gameOver === true) {
      return;
  }

    if (fugitiveMovementTickAccumulator >= tickLimit) {
        moveCharacterRoomPortrait('fugitive');
        console.log(`Fugitive room number: ${characters.fugitive.currentRoomNumber}`);
        if (characters.fugitive.currentRoomNumber === 10) {
          gameOver = true;
      }
        fugitiveMovementTickAccumulator = 0;
    }   
}

// Update Detective Position

const updateDetectivePosition = function() {
    const nextRoomNumber = characters.detective.currentRoomNumber + 1;

    if(gameOver === true) {
        // console.log(gameOver);
        return;
    }

    moveCharacterRoomPortrait('detective');
    console.log(`Detective room number: ${characters.detective.currentRoomNumber}`);

    if (characters.detective.currentRoomNumber === 10 || characters.detective.currentRoomNumber === characters.fugitive.currentRoomNumber) {
      gameOver = true;
      clearInterval(startTimer);
      new Message(characters.detective, "It's all over!");
      new Message(characters.fugitive, "Ugh! You're faster than I thought...")
      // console.log(gameOver);
      return;
  }

  // console.log(gameOver);
}

function openChatMode() {
  if (chatModeOpen === true) {
    return
  } else {
      // document.body.appendChild(bottomWrapper);
      // bottomWrapper.classList.remove('hidden');

      
    //   const onEnd = function () {
    //     requestAnimationFrame(() => recenterRoomPortraits());
    //     bottomWrapper.removeEventListener('transitionend', onEnd);
    //   }
      
    //   bottomWrapper.addEventListener('transitionend', onEnd);
      
    let perpetuator;

    const tick = function() {
      recenterRoomPortraits();
      perpetuator = requestAnimationFrame(tick);
    }

    const onEnd = function() {
      cancelAnimationFrame(perpetuator);
      recenterRoomPortraits();
      bottomWrapper.removeEventListener('transitionend', onEnd);
      return
    }

    bottomWrapper.addEventListener('transitionend', onEnd);
    bottomWrapper.style.height = '20%';
    topWrapper.style.height = '80%';
    requestAnimationFrame(tick);

    chatModeOpen = true;
    }


      
  }

function closeChatMode() {
  if (chatModeOpen === false) {
    return
  } else {
    
    let perpetuator;

    const tick = function() {
      recenterRoomPortraits();
      perpetuator = requestAnimationFrame(tick);
    }

    const onEnd = function() {
      cancelAnimationFrame(perpetuator);
      recenterRoomPortraits();
      bottomWrapper.removeEventListener('transitionend', onEnd);
      return
    }

      bottomWrapper.addEventListener('transitionend', onEnd);
      bottomWrapper.style.height = '0%';
      topWrapper.style.height = '100%';
      requestAnimationFrame(tick);
      
      chatModeOpen = false;
      };
      
      
  }

// Detective Movement Event Listener (Enter Key Press)

document.addEventListener('keyup', (e) => {
  if(e.key === 'Enter') {
    updateDetectivePosition();
  } else if (e.key === 'o') {
    openChatMode();
  } else if (e.key === 'c') {
    closeChatMode();
  } else if (e.key === 'r') {
    recenterRoomPortraits();
  } else return
});

// Overall initialization function

function initialize() {
    calculateFugitiveMovementTimeInterval();
    generateCharacterElements();
    
}

// Initialization function call

initialize();

// Timer Start

const startTimer = setInterval(() => {
    updateTimer(); 
    updateFugitivePosition();
}, 100);
