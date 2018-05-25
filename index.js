var Tail = require("always-tail2");
var util = require("util");
var events = require("events");
var fs = require("fs");

var LOGFILE = "C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt";
var INTERVAL = 1000;
var REGEX = {
    area: /\[INFO Client [0-9]*] : You have entered (.*)./,
    away: /\[INFO Client [0-9]*] : (DND|AFK) mode is now (?:(ON)\. Autoreply "(.*)"|(OFF))/,
    level: /\[INFO Client [0-9]*] : (.*) \((.*)\) is now level ([0-9]+)/,
    message: /\[INFO Client [0-9]*] (#|\$|%|&|)(?:<(\S+)> )*(\S+): (.*)/,
    whisper: /\[INFO Client [0-9]*] @(To|From) (?:<(\S+)> )*(\S+): (.*)/,
    login: /\[INFO Client [0-9]*] Connected to ([a-z]+[0-9]*\.login\.pathofexile\.com) in ([0-9]*)ms\./,
    joinChat: /\[INFO Client [0-9]*] : You have joined ([a-zA-Z0-9]+) chat channel ([0-9]+) ([a-zA-Z0-9]+)\./,
    deaths: /\[INFO Client [0-9]*] : You have died ([0-9]+) times\./
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

    this.tail = new Tail(this.logfile, "\n", {interval: this.interval});

    this.tail.on("line", function (line) {
        var areaMatch = line.match(REGEX.area);
        if (areaMatch) {
            self.evalArea(areaMatch);
            return;
        }

        var awayMatch = line.match(REGEX.away);
        if (awayMatch) {
            self.evalAway(awayMatch);
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
            return;
        }

        var loginMatch = line.match(REGEX.login);
        if (loginMatch) {
            self.evalLogin(loginMatch);
            return;
        }

        var joinChatMatch = line.match(REGEX.joinChat);
        if (joinChatMatch) {
            self.evalJoinChat(joinChatMatch);
            return;
        }

        var deathsMatch = line.match(REGEX.deaths);
        if (deathsMatch) {
            self.evalDeaths(deathsMatch);
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

PathOfExileLog.prototype.evalAway = function (match) {
    var data = {};
    var type = match[1].toLowerCase();

    data.status = false;
    data.autoreply = match[3] || "";

    if(match[2] !== undefined && match[2] === "ON" || match[4] !== undefined && match[4] === "ON") {
        data.status = true;
    }

    this.emit(type, data);
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

PathOfExileLog.prototype.evalWhisper = function (match) {
    var data = {};
    data.direction = match[1];
    data.guild = match[2];
    data.name = match[3];
    data.message = match[4];

    this.emit("whisper", data);
};

PathOfExileLog.prototype.evalLogin = function (match) {
    var data = {};
    data.server = match[1];
    data.latency = match[2];

    this.emit("login", data);
};

PathOfExileLog.prototype.evalJoinChat = function (match) {
    var data = {};
    data.chat = match[1];
    data.channel = match[2];
    data.language = match[3];

    this.emit("joinChat", data);
};

PathOfExileLog.prototype.evalDeaths = function (match) {
    var data = {};
    data.deaths = match[1];

    this.emit("deaths", data);
};

util.inherits(PathOfExileLog, events.EventEmitter);

module.exports = PathOfExileLog;
