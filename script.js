timerMinutesOnes = document.getElementById('timer-minutes-ones');
timerMinutesTens = document.getElementById('timer-minutes-tens');
timerSecondsOnes = document.getElementById('timer-seconds-ones');
timerSecondsTens = document.getElementById('timer-seconds-tens');

function updateTimer() {
  const seconds = timerSeconds.textContent;
  const minutes = timerMinutes.textContent;
  if (seconds > 0) {
    seconds--;
  }

  if (seconds === 0) {
    seconds = 59;
    minutes--;
  }
}

const secondsUpdate = setInterval(updateTimer(), 1000);

