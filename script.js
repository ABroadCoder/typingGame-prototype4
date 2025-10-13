// HTML Element References

const messageContainer = document.getElementById('message-container');
const timerMinutesOnes = document.getElementById('timer-minutes-ones');
const timerSecondsOnes = document.getElementById('timer-seconds-ones');
const timerSecondsTens = document.getElementById('timer-seconds-tens');

// Global Variable Definitions
let currentMessageId = 0;

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
    console.log(`${characterListing.portrait}`);

    messageNameContainer.textContent = character;

    messageTextContainer.textContent = this.text;

    generatedMessages[this.id] = this;
    console.log(generatedMessages);
  }
}

// Messages Testing

new Message('Fugitive', messages.fugitiveAlmostOut);
new Message('Detective', 'I will catch you!');

// Timer Logic

function updateTimer() {
  let secondsOnes = parseInt(timerSecondsOnes.innerHTML);
  let secondsTens = parseInt(timerSecondsTens.innerHTML);
  let minutesOnes = parseInt(timerMinutesOnes.innerHTML);

  if (secondsOnes > 0) {
    secondsOnes--;
  } else if (secondsOnes === 0) {
    if (secondsTens > 0) {
      secondsOnes = 9;
      secondsTens--;
    } else if (secondsTens === 0) {
      if (minutesOnes === 0 && secondsTens === 0 && secondsOnes === 0) {
        clearInterval(startTimer);
      } else {
        secondsTens = 5;
        secondsOnes = 9;
        minutesOnes--;
      }
    }
  }
  timerSecondsOnes.innerHTML = secondsOnes;
  timerSecondsTens.innerHTML = secondsTens;
  timerMinutesOnes.innerHTML = minutesOnes;
}

// Timer Start

// const startTimer = setInterval(updateTimer, 1000);
