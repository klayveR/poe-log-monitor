/**
* @event    PoeLog#death
* @type     {Object}
* @property {string} player.name
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : (\\S+) has been slain\\.";
module.exports.parse = (match) => {
  return {
    "player": {
      "name": match[1] || null
    }
  };
};
