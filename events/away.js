/**
* @event    PoeLog#away
* @type     {Object}
* @property {string}  type
* @property {boolean} status
* @property {string}  autoreply
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : (DND|AFK) mode is now (?:(ON)\\. Autoreply \"(.*)\"|(OFF))";
module.exports.parse = (match) => {
  return {
    "type": match[1].toLowerCase() || null,
    "status": getAwayStatus(match[2]),
    "autoreply": match[3] || null
  };
};

function getAwayStatus(status) {
  if (typeof status !== "undefined" && status === "ON") {
    return true;
  }

  return false;
}
