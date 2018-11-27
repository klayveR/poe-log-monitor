/**
* @event    PoeLog#joinChat
* @type     {Object}
* @property {string} chat     `global`, `local`, `trade`, `guild`, `party`
* @property {number} channel
* @property {string} language
*/

module.exports.pattern = "\\[INFO Client [0-9]*] : You have joined ([a-zA-Z0-9]+) chat channel ([0-9]+) ([a-zA-Z0-9]+)\\.";
module.exports.parse = (match) => {
  return {
    "chat": match[1] || null,
    "channel": parseInt(match[2]) || null,
    "language": match[3] || null
  };
};
