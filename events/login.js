/**
* @event    PoeLog#login
* @type     {Object}
* @property {string} address
* @property {number} latency
*/

module.exports.pattern = "\\[INFO Client [0-9]*] Connected to ([a-z]+[0-9]*\\.login\\.pathofexile\\.com) in ([0-9]*)ms\\.";
module.exports.parse = (match) => {
  return {
    "address": match[1] || null,
    "latency": parseInt(match[2]) || null
  };
};
