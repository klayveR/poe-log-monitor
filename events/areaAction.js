/**
* @event    PoeLog#areaAction
* @type     {Object}
* @property {string} address
* @property {string} player.name
* @property {string} action      `leave`, `join`
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : (\\S+) has (joined|left) the area\\.";
module.exports.parse = (match) => {
  return {
    "player": {
      "name": match[1] || null
    },
    "action": formatAreaAction(match[2]) || null
  };
};

function formatAreaAction(identifier) {
  if(typeof identifier === "string") {
    switch(identifier) {
      case "left":
        return "leave";
      case "joined":
        return "join";
      default:
        return null;
    }
  }

  return null;
}
