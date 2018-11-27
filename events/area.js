/**
* @event PoeLog#area
* @type {Object}
* @property {string} name
* @property {string} type
* @property {string} info
*/

const Areas = require("../resource/areas.json");
const _ = require("lodash");

module.exports.pattern = "\\[INFO Client [0-9]*] : You have entered (.*)\\.";
module.exports.parse = (match) => {
  let area = {
    "name": match[1] || null,
    "type": null,
    "info": null
  }

  let additionalInfo = getAdditionalAreaInfo(match[1]);
  if(additionalInfo) {
    _.assign(area, additionalInfo);
  }

  return area;
};

function getAdditionalAreaInfo(name) {
  for(var areaType in Areas) {
    if(_.has(Areas[areaType], name)) {
      return {
        "type": areaType,
        "info": Areas[areaType][name]
      };
    }
  }

  return null;
}
