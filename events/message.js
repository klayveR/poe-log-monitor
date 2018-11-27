/**
* @event    PoeLog#message
* @type     {Object}
* @property {string} chat         `global`, `local`, `trade`, `guild`, `party`
* @property {string} player.guild
* @property {string} player.name
* @property {string} text
*/

module.exports.pattern = "\\[INFO Client [0-9]*] ([#$&%])(?:<(.+)> )?((?!Enumerated )[a-zA-Z_, ]+): (.+)";
module.exports.parse = (match) => {
  return {
    "chat": formatChatType(match[1] || null),
    "player": {
      "guild": match[2] || null,
      "name": match[3] || null
    },
    "text": match[4] || null
  };
};

function formatChatType(identifier) {
  if(typeof identifier === "string") {
    switch(identifier) {
      case "#":
        return "global";
      case "&":
        return "guild";
      case "%":
        return "party";
      case "$":
        return "trade";
      default:
        return null;
    }
  }

  return null;
}

function parseTradeData(text) {

}
