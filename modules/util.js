module.exports = {
  "getTotalSeconds": (seconds, minutes, hours, days) => {
    seconds = parseInt(seconds) || 0;

    if(minutes) {
      seconds += parseInt(minutes) * 60;
    }

    if(hours) {
      seconds += parseInt(hours) * 60 * 60;
    }

    if(days) {
      seconds += parseInt(days) * 24 * 60 * 60;
    }

    return seconds;
  }
};
