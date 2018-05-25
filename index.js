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

    if (!fs.existsSync(this.logfile)) {
        this.emit("error", new Error("The specified log file \'" + this.logfile + "\' does not exist"));
        return;
    }

    this.tail = new Tail(this.logfile, "\n", {interval: this.interval});

    this.tail.on("line", function (line) {
        for (var eventName in Events) {
            if (!Events.hasOwnProperty(eventName)) continue;

            var event = Events[eventName];
            var match = line.match(new RegExp(event.regex));
            if(match) {
                if(event.hasOwnProperty('matches')) {
                    self.evalMatch(match, event.matches, eventName);
                } else if(event.hasOwnProperty('function')) {
                    self[event.function](match);
                }
                return;
            }
        }
    });

    this.tail.on("error", function (error) {
        self.emit("error", new Error("Tail has encountered an error: " + error));
    });
}

PathOfExileLog.prototype.start = function () {
    this.tail.watch();
    this.emit("start");
};

PathOfExileLog.prototype.pause = function () {
    this.tail.unwatch();
    this.emit("pause");
};

// This function simply puts match groups into a new object with the correct identifiers defined in the Events variable and emits it
PathOfExileLog.prototype.evalMatch = function (match, matches, event) {
    var data = {};
    for (var matchGroup in matches) {
        if (!matches.hasOwnProperty(matchGroup)) continue;

        var matchName = matches[matchGroup];
        data[matchName] = match[matchGroup];
    }

    this.emit(event, data);
}

PathOfExileLog.prototype.evalAway = function (match) {
    var data = {};
    var type = match[1].toLowerCase();

    data.status = false;
    data.autoreply = match[3] || "";

    if(typeof match[2] === 'undefined' && match[2] === "ON" || typeof match[4] === 'undefined' && match[4] === "ON") {
        data.status = true;
    }

    this.emit(type, data);
};

PathOfExileLog.prototype.evalMessage = function (match) {
    var data = {};
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

    data.guild = match[2];
    data.name = match[3];
    data.message = match[4];

    this.emit("message", data);
};

util.inherits(PathOfExileLog, EventEmitter);

module.exports = PathOfExileLog;
