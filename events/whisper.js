/**
* @event    PoeLog#whisper
* @type     {Object}
* @property {string} direction    `To`, `From`
* @property {string} player.guild
* @property {string} player.name
* @property {string} message
*/

const path = require("path");

module.exports.pattern = "\\[INFO Client [0-9]*] (?=[^#$&%]).*@(To|From) (?:<(.+)> )?([a-zA-Z_, ]+): (.+)";
module.exports.parse = (match) => {
  return {
    "direction": match[1] || null,
      "player": {
        "guild": match[2] || null,
        "name": match[3] || null
      },
    "message": match[4] || null
  };
};
