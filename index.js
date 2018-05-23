var Tail = require("always-tail2");
var util = require("util");
var events = require("events");
var fs = require("fs");

var LOGFILE = "C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt";
var INTERVAL = 1000;
var REGEX = {
    area: /\[INFO Client [0-9]*] : You have entered (.*)./,
    afk: /\[INFO Client [0-9]*] : AFK mode is now (?:(ON)\. Autoreply "(.*)"|(OFF))/,
    level: /\[INFO Client [0-9]*] : (.*) \((.*)\) is now level ([0-9]+)/,
    message: /\[INFO Client [0-9]*] (#|\$|%|&|)(?:<(\S+)> )*(\S+): (.*)/,
    whisper: /\[INFO Client [0-9]*] @(To|From) (?:<(\S+)> )*(\S+): (.*)/
};

function PathOfExileLog(options) {
    options = options || {};

    events.EventEmitter.call(this);

    var self = this;
    this.logfile = options.logfile || LOGFILE;
    this.interval = options.interval || INTERVAL;

    if (!fs.existsSync(this.logfile)) {
        this.emit("error", new Error("The specified log file \'" + this.logfile + "\' does not exist"));
        return;
    }

    this.tail = new Tail(this.logfile, '\n', {interval: this.interval});

    this.tail.on("line", function (line) {
        var areaMatch = line.match(REGEX.area);
        if (areaMatch) {
            self.evalArea(areaMatch);
            return;
        }

        var afkMatch = line.match(REGEX.afk);
        if (afkMatch) {
            self.evalAfk(afkMatch);
            return;
        }

        var levelMatch = line.match(REGEX.level);
        if (levelMatch) {
            self.evalLevel(levelMatch);
            return;
        }

        var messageMatch = line.match(REGEX.message);
        if (messageMatch) {
            self.evalMessage(messageMatch);
            return;
        }

        var whisperMatch = line.match(REGEX.whisper);
        if (whisperMatch) {
            self.evalWhisper(whisperMatch);
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

PathOfExileLog.prototype.evalArea = function (match) {
    var data = {};
    data.area = match[1];

    this.emit("area", data);

};

PathOfExileLog.prototype.evalAfk = function (match) {
    var data = {};
    data.autoReply = match[2];
    switch (match[1]) {
        case "ON":
            data.isAfk = true;
            break;
        case "OFF":
            data.isAfk = false;
            break;
    }

    this.emit("afk", data);
};

PathOfExileLog.prototype.evalLevel = function (match) {
    var data = {};
    data.name = match[1];
    data.characterClass = match[2];
    data.level = match[3];

    this.emit("level", data);
};

PathOfExileLog.prototype.evalMessage = function (match) {
    var data = {};
    switch (match[1]) {
        case "#":
            data.channel = "global";
            break;
        case "$":
            data.channel = "trade";
            break;
        case "&":
            data.channel = "guild";
            break;
        case "%":
            data.channel = "party";
            break;
        case "":
            data.channel = "local";
            break;
    }

    data.guild = match[2];
    data.name = match[3];
    data.message = match[4];

    this.emit("message", data);
};

PathOfExileLog.prototype.evalWhisper = function (match) {
    var data = {};
    data.direction = match[1];
    data.guild = match[2];
    data.name = match[3];
    data.message = match[4];

    this.emit("whisper", data);
};

util.inherits(PathOfExileLog, events.EventEmitter);

module.exports = PathOfExileLog;
