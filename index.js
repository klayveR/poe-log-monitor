var Tail = require("always-tail2");
var EventEmitter = require("events").EventEmitter;
var Events = require('./resource/events');
var util = require("util");
var fs = require("fs");

var LOGFILE = "C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt";
var INTERVAL = 1000;

function PathOfExileLog(options) {
    options = options || {};

    EventEmitter.call(this);

    var self = this;
    this.logfile = options.logfile || LOGFILE;
    this.interval = options.interval || INTERVAL;

    // Check if the specified log file exists
    if (!fs.existsSync(this.logfile)) {
        this.emit("error", new Error("The specified log file \'" + this.logfile + "\' does not exist"));
        return;
    }

    this.tail = new Tail(this.logfile, "\n", {interval: this.interval});

    // If a new line appears in the log file...
    this.tail.on("line", function (line) {
        // Try matching the line with a regular expression from the Events JSON
        for (var eventName in Events) {
            if (!Events.hasOwnProperty(eventName)) continue;

            var event = Events[eventName];
            var match = line.match(new RegExp(event.regex));
            if(match) {
                if(event.hasOwnProperty('matches')) { // Assign keys to matching groups
                    self.evalMatch(match, event.matches, eventName);
                } else if(event.hasOwnProperty('function')) { // Execute a function to further evaluate the matching data
                    // Check if the specified function is actually a function
                    if (typeof self[event.function] === "function") {
                        self[event.function](match); // Execute specified function
                    }
                }
                return;
            }
        }
    });

    this.tail.on("error", function (error) {
        self.emit("error", new Error("Tail has encountered an error: " + error));
    });
}

// Resumes monitoring the log file
PathOfExileLog.prototype.start = function () {
    this.tail.watch();
    this.emit("start");
};

// Pauses monitoring the log file
PathOfExileLog.prototype.pause = function () {
    this.tail.unwatch();
    this.emit("pause");
};

// This function simply puts match groups into a new object with the correct identifiers defined in the Events JSON and emits it
PathOfExileLog.prototype.evalMatch = function (match, matches, event) {
    var data = {};
    for (var matchGroup in matches) {
        if (!matches.hasOwnProperty(matchGroup)) continue;

        var matchName = matches[matchGroup];
        data[matchName] = match[matchGroup] || "";
    }

    this.emit(event, data);
};

// AFK/DND match
PathOfExileLog.prototype.evalAway = function (match) {
    var data = {};
    var type = match[1].toLowerCase();

    data.status = false;
    data.autoreply = match[3] || "";

    // Determine AFK/DND status
    if(typeof match[2] === 'undefined' && match[2] === "ON" ||
        typeof match[4] === 'undefined' && match[4] === "ON") {
        data.status = true;
    }

    this.emit(type, data);
};

// Message
PathOfExileLog.prototype.evalMessage = function (match) {
    var data = {};

    // Get chat
    switch (match[1]) {
        case "#":
            data.chat = "global";
            break;
        case "$":
            data.chat = "trade";
            break;
        case "&":
            data.chat = "guild";
            break;
        case "%":
            data.chat = "party";
            break;
        case "":
            data.chat = "local";
            break;
    }

    // Assign other variables
    data.guild = match[2];
    data.name = match[3];
    data.message = match[4];

    this.emit("message", data);
};

util.inherits(PathOfExileLog, EventEmitter);

module.exports = PathOfExileLog;
