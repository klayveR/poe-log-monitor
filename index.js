const EventEmitter = require("events");
const TailStream = require("tail-stream");
const LineReader = require("line-reader");
const Defaults = require("./resource/defaults");
const Events = require("./events");
const util = require('util');
const fs = require("fs");
const _ = require("lodash");

const eachLine = util.promisify(LineReader.eachLine);
const access = util.promisify(fs.access);

class PoeLog extends EventEmitter {
  /**
   * @constructor
   * @param {Object}  [options] - An optional parameter object
   * @param {string}  [options.logfile=C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt] - Path to `Client.txt` log file
   * @param {boolean} [options.timestamps=true] - Adds timestamps to events
   */
  constructor(options) {
    super();

    this.options = _.defaults(options, Defaults);
    this.stream = null;
  }

  /**
   * Starts monitoring the Path of Exile log file
   *
   * @returns {Promise}
   */
  start() {
    return access(this.options.logfile, fs.constants.F_OK)
    .then(() => {
      this._unbindTailStreamEvents(this.stream);
      this.stream = TailStream.createReadStream(this.options.logfile, {
        "beginAt": "end",
        "onMove": "stay",
      });
      this._bindTailStreamEvents(this.stream);

      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
  }

  /**
  * Stops monitoring the Path of Exile log file
  */
  stop() {
    this._unbindTailStreamEvents(this.stream);
  }

  /**
  * Parses the entire Client.txt and returns the events in an array
  *
  * @param   {Object} [options] - An optional parameter object
  * @param   {Array}  [options.events=All events] - An array containing the events that should be included
  * @returns {Promise<Array>}
  */
  parseLog(options) {
    options = _.defaults(options, {
      "events": this.getEvents()
    });

    let events = [];

    // Check if file exists
    return access(this.options.logfile, fs.constants.F_OK)
    .then(() => {
      // Read each line, parse and add to events array if valid
      return eachLine(this.options.logfile, (line) => {
        let result = this._parseLine(line);

        // Add event if line successfully parsed and is included in events parameter
        if(result && _.includes(options.events, result.event)) {
          events.push(result);
        }
      });
    })
    .then(() => {
      // Return full events array once every line has been processed
      return Promise.resolve(events);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
  }

  /**
   * Returns the full list of events
   *
   * @returns {Array}
   */
  getEvents() {
    let events = [];

    for(let eventName in Events) {
      events.push(eventName);
    }

    return events;
  }

  /**
  * Binds events for the read stream
  *
  * @private
  * @param {EventEmitter} stream
  */
  _bindTailStreamEvents(stream) {
    if(stream instanceof EventEmitter.EventEmitter) {
      stream.on("data", (data) => {
        this._handleTailStreamData(data);
      });

      stream.on("error", (error) => {
        /**
         * @event PoeLog#error
         * @type  {Error}
         */
        this.emit("error", error);
      });
    }
  }

  /**
  * Splits data into lines, parses them and emits corresponding events
  *
  * @private
  * @param {Buffer} data
  */
  _handleTailStreamData(data) {
    // Convert buffer to string, split at new lines and remove invalid values
    let lines = _.compact(data.toString().split("\n"));

    for(let index in lines) {
      let result = this._parseLine(lines[index]);

      if(result) {
        this.emit(result.event, result);
      }
    }
  }

  /**
   * Unbinds events of existing read stream
   *
   * @private
   * @param {EventEmitter} stream
   */
  _unbindTailStreamEvents(stream) {
    if(stream instanceof EventEmitter.EventEmitter) {
      stream.removeAllListeners();
    }
  }

  /**
   * Iterates through each event regex pattern and calls the corresponding parsing
   * method from the `events` folder, if it exists
   *
   * @private
   * @param   {string} line Logfile line that should be tested against event patterns
   * @returns {Object}
   */
  _parseLine(line) {
    for(let eventName in Events) {
      let event = Events[eventName];
      let regex = new RegExp(event.pattern);
      let match = regex.exec(line);

      if(match && typeof event.parse === "function") {
        let result = event.parse(match);

        // Add event name
        result = _.assign(result, { "event": eventName });

        // Add timestamp if enabled in options
        if(this.options.timestamps) {
          result = _.assign(result, { "timestamp": this._parseTimestamp(line) });
        }

        return result;
      }
    }

    return;
  }

  /**
   * Returns timestamp of the event
   *
   * @private
   * @param   {string} line
   * @returns {Date}
   */
  _parseTimestamp(line) {
    let pattern = "([0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2})";
    let regex = new RegExp(pattern);
    let match = regex.exec(line);

    if(match) {
      return new Date(match[1]);
    }

    return null;
  }
}

module.exports = PoeLog;
