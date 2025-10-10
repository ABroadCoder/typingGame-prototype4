// HTML Element References
timerMinutesOnes = document.getElementById('timer-minutes-ones');
timerSecondsOnes = document.getElementById('timer-seconds-ones');
timerSecondsTens = document.getElementById('timer-seconds-tens');

// Comments Data Structure
const messagesObject = {
  suspectAlmostOut: "Ha! I'm going to escape!",
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
const startTimer = setInterval(updateTimer, 1000);
