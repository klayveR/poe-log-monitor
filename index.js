const EventEmitter = require("events");
const TailStream = require("tail-stream");
const Defaults = require("./resource/defaults");
const Events = require("./events");
const byline = require("byline")
const util = require("util");
const fs = require("fs");
const _ = require("lodash");

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
    this.eventNames = this._getEventNames(Events);
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
   * Returns the full list of events
   *
   * @returns {Array}
   */
  getEvents() {
    return this.eventNames;
  }

  /**
  * Parses the entire `Client.txt` and returns the events in an array utilizing a read stream
  *
  * @param   {Object} [options] - An optional parameter object
  * @param   {Array}  [options.events=All events] - An array containing the events that should be included
  * @returns {Promise<Array>}
  */
  parseLog(options) {
    return access(this.options.logfile, fs.constants.F_OK)
    .then(() => {
      return this._parseLogByLine(options);
    })
    .then((result) => {
      return Promise.resolve(result);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
  }

  /**
  * Parses the entire log using a read stream
  *
  * @private
  * @param   {Object} options
  * @returns {Promise<Array>}
  */
  _parseLogByLine(options) {
    options = _.defaults(options, {
      "events": this.getEvents()
    });

    /* Validate event names, omit any events that are not part of the Events object */
    options.events = _.intersection(this.eventNames, options.events);

    return new Promise((resolve) => {
      let events = [];
      let stream = fs.createReadStream(this.options.logfile, { "encoding": "utf8" });
      stream = byline.createStream(stream);

      stream.on("data", (line) => {
        let result = this._parseLine(line, { "events": options.events });

        if(result && _.includes(options.events, result.event)) {
          events.push(result);
        }
      });

      stream.on("end", () => {
        resolve(events);
      });
    });

    return result;
  }

  /**
  * Parses the entire log using a read stream
  *
  * @private
  * @param   {Object} options
  * @returns {Promise<Array>}
  */
  _parseLogStream(options) {
    options = _.defaults(options, {
      "events": this.getEvents(),
      "chunkSize": 1024 * 64
    });

    return new Promise((resolve) => {
      let stream = fs.createReadStream(this.options.logfile, { "encoding": "utf8", "highWaterMark": options.chunkSize });
      let events = [];
      let lastLine = null;

      stream.on("data", (data) => {
        if(lastLine) {
          /* Put previously chunked line in front of new data */
          data = lastLine + data;
        }

        let lines = _.compact(data.toString().split("\n"));

        for(const index in lines) {
          let line = lines[index];
          let result = this._parseLine(line);

          if(result && _.includes(options.events, result.event)) {
            /* Add event if line successfully parsed and is included in events parameter */
            events.push(result);
          } else if(index == (lines.length - 1)) {
            /* If this is the last line and it could not be parsed, store it
             * and put it in front of the new data set later, in case the chunking
             * cut off the full line */
            lastLine = line;
          } else {
            /* In every other case, reset the last line stored */
            lastLine = null;
          }
        }
      });

      stream.on("end", () => {
        resolve(events);
      });
    });
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
    /* Convert buffer to string, split at new lines and remove invalid values */
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
   * @param   {string} line - Logfile line that should be tested against event patterns
   * @param   {Array}  events - Events that should be tested for
   * @returns {Object}
   */
  _parseLine(line, options) {
    options = _.defaults(options, {
      "events": this.getEvents()
    });

    for(const index in options.events) {
      let eventName = options.events[index];
      let event = Events[eventName];

      /* Skip if event is invalid */
      if(!event) {
        continue;
      }

      let regex = new RegExp(event.pattern);
      let match = regex.exec(line);

      if(match && typeof event.parse === "function") {
        let result = event.parse(match);

        /* Add event name */
        result = _.assign(result, { "event": eventName });

        /* Add timestamp if enabled in options */
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

  /**
   * Returns the full list of event names
   *
   * @returns {Array}
   */
  _getEventNames(events) {
    let eventNames = [];

    for(const name in events) {
      eventNames.push(name);
    }

    return eventNames;
  }
}

module.exports = PoeLog;
