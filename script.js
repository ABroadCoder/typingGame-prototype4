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

const typingWrapper = document.getElementById('typing-wrapper');
const mapPromptContainer = document.getElementById('prompt-container-map');
const mapInputContainer = document.getElementById('input-container-map');

// Global Variable Initializations

let initialTimerTimeInTenthsOfSeconds = 1200;
let timerTimeInTenthsOfSeconds = initialTimerTimeInTenthsOfSeconds;
let fugitiveMovementTimeInterval = 0;
let fugitiveMovementTickAccumulator = 0;
let numberOfRooms = 9;
let gameOver = false;
let chatModeOpen = false;
let currentMessageId = -1;
let currentMapPromptIndex = -1;
let currentMapTypingIndex = -1;

// Sound effects

const detectiveMovementSound = new Audio('detective-moving.wav');
detectiveMovementSound.volume = 0.4;

const fugitiveMovementSound = new Audio('fugitive-moving.wav');
fugitiveMovementSound.volume = 0.8;

// Allowed Keys Data Structure (Built Here in Steps)

const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
// Add uppercase letters
const upperCaseLetters = lowerCaseLetters.map(el => el.toUpperCase());
const allLetters = [...lowerCaseLetters, ...upperCaseLetters];
allLetters.unshift(' ');
const allowedKeys = allLetters;
console.log(allowedKeys);

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

// Prompts Data Structure

const prompts = [
  'Need to go fast',
  'Speed is the key',
  'I want to catch up',
  'The fugitive is escaping',
  'I can do this',
  'Smooth and steady',
  'Just a bit farther',
  'Cool and confident',
];

// Characters Data Structure

const characters = {
  fugitive: {
    name: 'Fugitive',
    portrait: 'fugitive-portrait.png',
    element: '',
    startingRoomNumber: 4,
    currentRoomNumber: 4,
    currentLeft: '0px',
    currentTop: '0px',
    movementSound: fugitiveMovementSound,
  },
  detective: {
    name: 'Detective',
    portrait: 'detective-portrait.png',
    element: '',
    startingRoomNumber: 1,
    currentRoomNumber: 1,
    currentLeft: '0px',
    currentTop: '0px',
    movementSound: detectiveMovementSound,
  },
};

// Generated Message Objects Data Structure

let generatedMessages = {};

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

// Boxed Word Class

class BoxedPrompt {
  constructor() {
    this.create();
  }

  create() {
    // Exit function if prompts have all been used
    if (currentMapPromptIndex >= prompts.length - 1) {
      return;
    }

    // Advance prompt index to be current
    currentMapPromptIndex++;

    // Initialize letter box typing index
    currentMapTypingIndex = -1;

    // Set this.text value
    this.text = prompts[currentMapPromptIndex];

    // Clear previous contents
    mapPromptContainer.innerHTML = '';
    mapInputContainer.innerHTML = '';

    // Parse prompt into individual characters
    let promptArray = [...this.text];
    console.log(promptArray);

    // Create letter boxes for the prompt text (see CSS for styling)
    promptArray.forEach((item, index) => {
      const el = document.createElement('div');
      mapPromptContainer.appendChild(el);
      el.classList.add('prompt-letter-box');
      el.id = `prompt-letter-box-${index}`;
      el.textContent = item;

      // Prevent collapse of boxes containing only a space
      if (item === ' ') {
        el.classList.add('spacer');
        el.style.height =
          mapPromptContainer.getBoundingClientRect().height + 'px';
      }
    });

    // Create letter boxes for the input text (see CSS for styling)
    promptArray.forEach((item, index) => {
      const el = document.createElement('div');
      mapInputContainer.appendChild(el);
      el.classList.add('input-letter-box');
      el.id = `input-letter-box-${index}`;

      // Set starting dimensions of input letter boxes (may interrupt dynamic resizing...perhaps use pseudoelement for cursor in CSS instead)

      el.style.width =
        document
          .getElementById(`prompt-letter-box-${index}`)
          .getBoundingClientRect().width + 'px';
      el.style.height =
        document
          .getElementById(`prompt-letter-box-${index}`)
          .getBoundingClientRect().height + 'px';
    });

    // Add cursor effect to first input letter box
    document.getElementById('input-letter-box-0').classList.add('has-cursor');
  }
}

// Messages Testing

new Message(characters.fugitive, messages.fugitiveAlmostOut);
new Message(characters.detective, 'I will catch you!');
new Message(characters.detective, 'This is getting difficult!');

// Timer Display Logic

function updateTimer() {
  // Variable Reference Method

  let secondsOnes = Math.floor((timerTimeInTenthsOfSeconds / 10) % 10);
  let secondsTens = Math.floor(((timerTimeInTenthsOfSeconds / 10) % 60) / 10);
  let minutesOnes = Math.floor(timerTimeInTenthsOfSeconds / 10 / 60);

  timerSecondsOnes.innerHTML = secondsOnes;
  timerSecondsTens.innerHTML = secondsTens;
  timerMinutesOnes.innerHTML = minutesOnes;

  if (timerTimeInTenthsOfSeconds > 0) {
    timerTimeInTenthsOfSeconds--;
  } else clearInterval(startTimer);
}

// Initializing functions

function calculateFugitiveMovementTimeInterval() {
  const currentRoomId = `room${characters.fugitive.currentRoomNumber}`;
  const currentRoomNumber = parseInt(currentRoomId.replace('room', ''));

  const finalRoomNumber = numberOfRooms;

  const movesToExit = finalRoomNumber - currentRoomNumber + 1;

  fugitiveMovementTimeInterval = Math.floor(
    initialTimerTimeInTenthsOfSeconds / movesToExit
  );
  return fugitiveMovementTimeInterval;
}

function randomizeMapTypingPrompts() {
  console.log(`Unshuffled prompts: ${[...prompts]}`);

  for (i = 0; i < prompts.length; i++) {
    // Generate a random index for swapping values
    let randomIndex = Math.floor(Math.random() * prompts.length);
    console.log(`Random index for step ${i}: ${randomIndex}`);
    // Swap the current index's value with that of the random index
    let first = prompts[i];
    let second = prompts[randomIndex];

    prompts[i] = second;
    prompts[randomIndex] = first;

    console.log(`Prompt shuffle ${i}: ${[...prompts]}`);
  }
}

function generateTypingPrompt() {
  new BoxedPrompt();
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

    const left = roomRect.x - parentRect.x + 0.5 * roomRect.width;
    const top = roomRect.y - parentRect.y + 0.5 * roomRect.height;

    character.currentLeft = el.style.left = `${left}px`;
    character.currentTop = el.style.top = `${top}px`;

    mapContainer.appendChild(el);

    character.element = el;
  });
}

// Move a Character Room Portrait

const moveCharacterRoomPortrait = function (character = String) {
  // Translation Method

  const el = document.getElementById(character);
  const currentRoom = document.getElementById(
    `room${characters[character].currentRoomNumber}`
  );
  const targetRoom = document.getElementById(
    `room${characters[character].currentRoomNumber + 1}`
  );

  const currentRoomLeft = currentRoom?.getBoundingClientRect().left;
  const currentRoomTop = currentRoom?.getBoundingClientRect().top;
  const targetRoomLeft = targetRoom?.getBoundingClientRect().left;
  const targetRoomTop = targetRoom?.getBoundingClientRect().top;

  const shiftX = targetRoomLeft - currentRoomLeft;
  const shiftY = targetRoomTop - currentRoomTop;

  if (
    character === 'fugitive' &&
    characters[character].currentRoomNumber === 9
  ) {
    el.style.transform = 'translate(-50%, -150vh)';
    characters[character].currentRoomNumber++;
    return;
  }

  // Update left and top values in characters object
  characters[character].currentLeft = el.style.left =
    parseInt(el.style.left) + shiftX + 'px';
  characters[character].currentTop = el.style.top =
    parseInt(el.style.top) + shiftY + 'px';

  characters[character].currentRoomNumber++;

  // Multiple portraits in a room => offset x
  fitMultipleRoomPortraits(character);

  // Play appropriate sound effect
  characters[character].movementSound.play();
};

// Adjust portrait positions when two are in the same room
function fitMultipleRoomPortraits(movingCharacter) {
  const otherCharacter =
    movingCharacter === 'detective' ? 'fugitive' : 'detective';

  const nudgeX = 55;

  if (
    characters[movingCharacter].currentRoomNumber ===
    characters[otherCharacter].currentRoomNumber
  ) {
    document.getElementById(`${movingCharacter}`).style.left =
      parseInt(document.getElementById(`${movingCharacter}`).style.left) -
      nudgeX +
      'px';
    characters[otherCharacter].element.style.left =
      parseInt(characters[otherCharacter].element.style.left) + nudgeX + 'px';
  }
}

// Adjust portrait positions following resizing of map (e.g. when bottom container opens)
function recenterRoomPortraits() {
  if (characters.fugitive.currentRoomNumber >= 10) {
    const room = document.getElementById(
      `room${characters.detective.currentRoomNumber}`
    );
    const parent = mapContainer;
    const portrait = document.getElementById(
      characters.detective.name.toLowerCase()
    );

    const parentLeft = parent.getBoundingClientRect().left;
    const parentTop = parent.getBoundingClientRect().top;

    const targetLeft = room.getBoundingClientRect().left;
    const targetTop = room.getBoundingClientRect().top;

    const newLeft =
      parseInt(targetLeft) -
      parseInt(parentLeft) +
      0.5 * room.getBoundingClientRect().width;
    const newTop =
      parseInt(targetTop) -
      parseInt(parentTop) +
      0.5 * room.getBoundingClientRect().height;

    portrait.style.left = `${newLeft}px`;
    portrait.style.top = `${newTop}px`;

    console.log('Recentering function has run');
  } else {
    Object.values(characters).forEach(character => {
      const room = document.getElementById(
        `room${character.currentRoomNumber}`
      );
      const parent = mapContainer;
      const portrait = document.getElementById(character.name.toLowerCase());

      const parentLeft = parent.getBoundingClientRect().left;
      const parentTop = parent.getBoundingClientRect().top;

      const targetLeft = room.getBoundingClientRect().left;
      const targetTop = room.getBoundingClientRect().top;

      const newLeft =
        parseInt(targetLeft) -
        parseInt(parentLeft) +
        0.5 * room.getBoundingClientRect().width;
      const newTop =
        parseInt(targetTop) -
        parseInt(parentTop) +
        0.5 * room.getBoundingClientRect().height;

      portrait.style.left = `${newLeft}px`;
      portrait.style.top = `${newTop}px`;

      console.log('Recentering function has run');
    });
  }

  if (
    characters.detective.currentRoomNumber ===
    characters.fugitive.currentRoomNumber
  ) {
    fitMultipleRoomPortraits('detective');
  }
}

//  Automatically Update Fugitive Position
const updateFugitivePosition = function () {
  const tickLimit = fugitiveMovementTimeInterval;

  fugitiveMovementTickAccumulator++;

  if (gameOver === true) {
    return;
  }

  if (fugitiveMovementTickAccumulator >= tickLimit) {
    moveCharacterRoomPortrait('fugitive');
    console.log(
      `Fugitive room number: ${characters.fugitive.currentRoomNumber}`
    );
    if (characters.fugitive.currentRoomNumber === 10) {
      gameOver = true;
    }
    fugitiveMovementTickAccumulator = 0;
  }
};

// Update Position of Typing Wrapper

function updateTypingWrapperPosition() {
  // const mapRect = mapContainer.getBoundingClientRect();
  // const mapLeft = mapRect.left;
  // const mapTop = mapRect.top;

  // Reference current dimensions and coordinates of detective element
  // console.log(`${characters.detective.element}`);
  const detectiveRect = characters.detective.element.getBoundingClientRect();
  const detectiveLeft = characters.detective.currentLeft;
  const detectiveTop = characters.detective.currentTop;

  // Reference dimensions of typing wrapper element
  const typingRect = typingWrapper.getBoundingClientRect();

  // Calculate new coordinates of typing wrapper, centered below detective
  const typingLeft = parseInt(detectiveLeft) - 0.5 * typingRect.width + 'px';

  const typingTop = parseInt(detectiveTop) + 0.5 * detectiveRect.height + 'px';

  // Set new coordinates of typing wrapper
  typingWrapper.style.left = typingLeft;
  typingWrapper.style.top = typingTop;
}

// Update Detective Position

const updateDetectivePosition = function () {
  const nextRoomNumber = characters.detective.currentRoomNumber + 1;

  if (gameOver === true) {
    // console.log(gameOver);
    return;
  }

  moveCharacterRoomPortrait('detective');
  // console.log(
  //   `Detective room number: ${characters.detective.currentRoomNumber}`
  // );
  updateTypingWrapperPosition();

  if (
    characters.detective.currentRoomNumber === 10 ||
    characters.detective.currentRoomNumber ===
      characters.fugitive.currentRoomNumber
  ) {
    gameOver = true;
    clearInterval(startTimer);
    new Message(characters.detective, "It's all over!");
    new Message(characters.fugitive, "Ugh! You're faster than I thought...");
    // console.log(gameOver);
    return;
  }

  // console.log(gameOver);
};

function openChatMode() {
  if (chatModeOpen === true) {
    return;
  } else {
    // document.body.appendChild(bottomWrapper);
    // bottomWrapper.classList.remove('hidden');

    //   const onEnd = function () {
    //     requestAnimationFrame(() => recenterRoomPortraits());
    //     bottomWrapper.removeEventListener('transitionend', onEnd);
    //   }

    //   bottomWrapper.addEventListener('transitionend', onEnd);

    let perpetuator;

    const tick = function () {
      recenterRoomPortraits();
      perpetuator = requestAnimationFrame(tick);
    };

    const onEnd = function () {
      cancelAnimationFrame(perpetuator);
      recenterRoomPortraits();
      bottomWrapper.removeEventListener('transitionend', onEnd);
      return;
    };

    bottomWrapper.addEventListener('transitionend', onEnd);
    bottomWrapper.style.height = '20%';
    topWrapper.style.height = '80%';
    requestAnimationFrame(tick);

    chatModeOpen = true;
  }
}

function closeChatMode() {
  if (chatModeOpen === false) {
    return;
  } else {
    let perpetuator;

    const tick = function () {
      recenterRoomPortraits();
      perpetuator = requestAnimationFrame(tick);
    };

    const onEnd = function () {
      cancelAnimationFrame(perpetuator);
      recenterRoomPortraits();
      bottomWrapper.removeEventListener('transitionend', onEnd);
      return;
    };

    bottomWrapper.addEventListener('transitionend', onEnd);
    bottomWrapper.style.height = '0%';
    topWrapper.style.height = '100%';
    requestAnimationFrame(tick);

    chatModeOpen = false;
  }
}

// Prompt-response Agreement Check (Red-letter Functionality)
function checkLetter() {
  const pb = document.getElementById(
    `prompt-letter-box-${currentMapTypingIndex}`
  );
  const ib = document.getElementById(
    `input-letter-box-${currentMapTypingIndex}`
  );

  if (ib.textContent !== pb.textContent) {
    if (ib.textContent === ' ') {
      ib.classList.add('incorrect-space');
    } else {
      ib.classList.add('incorrect-letter');
    }
  } else {
    ib.classList.remove('incorrect-letter', 'incorrect-space');
  }
}

function playTypingAnim(element, className) {
  // Initiate animation by adding its class
  element.classList.add(className);

  // Define a self-removal function
  const onEnd = () => {
    element.classList.remove(className);
    element.removeEventListener('animationend', onEnd);
  };

  // Listen for end of animation and call self-removal function
  element.addEventListener('animationend', onEnd);
}

function inputCorrect() {
  playTypingAnim(characters.detective.element, 'success-anim-detective');
  playTypingAnim(typingWrapper, 'success-anim-wrapper');
  const onEnd = function () {
    updateDetectivePosition();
    characters.detective.element.removeEventListener('animationend', onEnd);
  };
  characters.detective.element.addEventListener('animationend', onEnd);
}

function inputIncorrect() {
  playTypingAnim(typingWrapper, 'error-anim');
}

function triggerWin() {
  typingWrapper.classList.add('hidden');
  mapInputContainer.classList.add('hidden');
  mapPromptContainer.classList.add('hidden');
}

function triggerLoss() {}

// Typing Keys Event Listener

document.addEventListener('keydown', e => {
  console.log(`Key pressed: ${e.key}`);

  // Listen for arrow keys
  if (e.key === 'ArrowLeft') {
    // Move cursor to previous letter boxes
  }

  if (e.key === 'ArrowRight') {
    // Move cursor to subsequent letter boxes
  }

  // Listen for Enter key
  if (e.key === 'Enter') {
    // Set state variables for correctness conditions
    let allFilled = true;
    let noneIncorrect = true;

    // Check correctness conditions:

    // (1) all input letter boxes are full;
    if (currentMapTypingIndex < prompts[currentMapPromptIndex].length - 1) {
      allFilled = false;
    }

    // (2) each input letter box has neither the incorrect-letter class nor the incorrect-space class.
    noneIncorrect =
      document.querySelector(
        '.input-letter-box.incorrect-letter, .input-letter-box.incorrect-space'
      ) === null;

    // If input passes, play success animation, move detective, and update prompt
    if (allFilled === true && noneIncorrect === true) {
      inputCorrect();
      if (
        characters.detective.currentRoomNumber ===
        characters.fugitive.currentRoomNumber
      ) {
        triggerWin();
      } else {
        generateTypingPrompt();
      }
    }

    // If input fails, play failure animation and exit function
    else {
      inputIncorrect();
      return;
    }
    // } else if (e.key === 'o') {
    //   openChatMode();
    // } else if (e.key === 'c') {
    //   closeChatMode();
    // } else if (e.key === 'r') {
    //   recenterRoomPortraits();
  }

  // Listen for backspace key
  if (e.key === 'Backspace') {
    // Check that cursor isn't at the start
    if (currentMapTypingIndex >= 0) {
      // Define current letter boxes
      const plb = document.getElementById(
        `prompt-letter-box-${currentMapTypingIndex}`
      );
      const ilb = document.getElementById(
        `input-letter-box-${currentMapTypingIndex}`
      );

      // Clear content of input typing box
      ilb.textContent = '';

      // Reset width of prompt letter box to match content
      plb.style.width = 'auto';

      // Rest width of input letter box to match that of prompt typing box
      ilb.style.width = plb.scrollWidth + 'px';

      // Remove red background for previously incorrect spaces
      ilb.classList.remove('incorrect-space');

      // Move cursor back
      if (
        document.getElementById(`input-letter-box-${currentMapTypingIndex + 1}`)
      ) {
        document
          .getElementById(`input-letter-box-${currentMapTypingIndex + 1}`)
          .classList.remove('has-cursor');
      }
      ilb.classList.add('has-cursor');

      // Decrement typing index
      currentMapTypingIndex--;
    }
    // Exit function if cursor is at the start
    else return;
  }

  // Listen for letters and spaces
  if (allowedKeys.includes(e.key)) {
    console.log(`Allowed key pressed: ${e.key}`);
    // Increment typing index to be current
    if (currentMapTypingIndex < prompts[currentMapPromptIndex].length - 1) {
      currentMapTypingIndex++;
    }

    // Exit if last letter box is already full
    else {
      return;
    }

    // Define current letter boxes
    const ilb = document.getElementById(
      `input-letter-box-${currentMapTypingIndex}`
    );
    const plb = document.getElementById(
      `prompt-letter-box-${currentMapTypingIndex}`
    );

    plb.style.width = 'auto';
    ilb.style.width = 'auto';

    // Set text content to key value
    if (e.key === ' ') {
      ilb.textContent = ' ';
      // Prevent collapse of letter boxes containing only a space
      ilb.classList.add('spacer');
    } else {
      ilb.classList.remove('spacer');
      ilb.textContent = e.key;
    }

    // Check typed character against prompt and mark red if incorrect
    checkLetter();

    // Advance cursor
    ilb.classList.remove('has-cursor');

    if (
      document.getElementById(`input-letter-box-${currentMapTypingIndex + 1}`)
    ) {
      document
        .getElementById(`input-letter-box-${currentMapTypingIndex + 1}`)
        .classList.add('has-cursor');
    }

    // Adjust slimmer letter box width to match that of wider letter box (input or prompt)
    const w = Math.max(ilb.scrollWidth, plb.scrollWidth);
    plb.style.width = w + 'px';
    ilb.style.width = w + 'px';

    // Exit function
    return;
  }
});

// Overall initialization function

function initialize() {
  calculateFugitiveMovementTimeInterval();
  generateCharacterElements();
  randomizeMapTypingPrompts();
  generateTypingPrompt();
  updateTypingWrapperPosition();
}

// Initialization function call

initialize();

// Timer Start

const startTimer = setInterval(() => {
  updateTimer();
  updateFugitivePosition();
}, 100);
