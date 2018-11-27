/**
* @event    PoeLog#deaths
* @type     {Object}
* @property {number} deaths
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : You have died ([0-9]+) times\\.";
module.exports.parse = (match) => {
  return {
    "deaths": parseInt(match[1]) || null
  };
};
