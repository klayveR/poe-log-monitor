/**
* @event    PoeLog#age
* @type     {Object}
* @property {number} days
* @property {number} hours
* @property {number} minutes
* @property {number} seconds
* @property {number} totalSeconds
*/

const Util = require("../modules/util.js");

module.exports.pattern = "\\[INFO Client [0-9]*] : Your character was created (?:([0-9]*) days?)?(?:, )?(?:([0-9]*) hours?)?(?:, )?(?:([0-9]*) minutes?)?(?:, )?(?:and )?(?:([0-9]*) seconds?)";
module.exports.parse = (match) => {
  let totalSeconds = Util.getTotalSeconds(match[4], match[3], match[2], match[1]);

  return {
    "days": parseInt(match[1]) || null,
    "hours": parseInt(match[2]) || null,
    "minutes": parseInt(match[3]) || null,
    "seconds": parseInt(match[4]) || null,
    "totalSeconds": totalSeconds || null
  };
};
