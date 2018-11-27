/**
* @event    PoeLog#trade
* @type     {Object}
* @property {boolean} accepted
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : Trade (cancelled|accepted)";
module.exports.parse = (match) => {
  return {
    "accepted": match[1] === "accepted" || null
  };
};
