/**
* @event    PoeLog#instanceServer
* @type     {Object}
* @property {string} address
*/

module.exports.pattern = "\\[INFO Client [0-9]*] Connecting to instance server at (.*)";
module.exports.parse = (match) => {
  return {
    "address": match[1] || null
  };
};
