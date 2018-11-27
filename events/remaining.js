/**
* @event    PoeLog#remaining
* @type     {Object}
* @property {number} remaining
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : (?:More than )?([0-9]+) monsters? remain\\.";
module.exports.parse = (match) => {
  return {
    "remaining": parseInt(match[1]) || null
  };
};
