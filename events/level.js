/**
* @event    PoeLog#level
* @type     {Object}
* @property {string} player.name
* @property {string} player.class
* @property {number} player.level
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : (.*) \\((.*)\\) is now level ([0-9]+)";
module.exports.parse = (match) => {
  return {
    "player": {
      "name": match[1] || null,
      "class": match[2] || null,
      "level": parseInt(match[3]) || null
    }
  };
};
