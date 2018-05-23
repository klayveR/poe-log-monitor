var Tail = require('always-tail2');
var util = require("util");
var events = require("events");
var fs = require('fs');

var LOGFILE = 'C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt';
var INTERVAL = 1000;
var REGEX = {
    areaEnter: /\[INFO Client [0-9]*] : You have entered (.*)./,
    afk: /\[INFO Client [0-9]*] : AFK mode is now (?:(ON)\. Autoreply "(.*)"|(OFF))/,
    levelUp: /\[INFO Client [0-9]*] : (.*) \((.*)\) is now level ([0-9]+)/,
    message: /\[INFO Client [0-9]*] (#|\$|%|&|)(?:<([^\s]+)> )*([^\s]+): (.*)/,
    whisper: /\[INFO Client [0-9]*] @(To|From) (?:<([^\s]+)> )*([^\s]+): (.*)/
};

function PathOfExileLog(options) {
    options = options || {};

    events.EventEmitter.call(this);

    var self = this;
    this.logfile = options.logfile || LOGFILE;
    this.interval = options.interval || INTERVAL;

    if (!fs.existsSync(this.logfile)) {
        this.emit("error", new Error('The specified log file \'' + this.logfile + '\' does not exist'));
        return;
    }

    this.tail = new Tail(this.logfile, '\n', {interval: this.interval});

    this.tail.on("line", function (line) {
        var data = {};

        // Check if entered new area
        if (match = line.match(REGEX.areaEnter)) {
            data.area = match[1];

            self.emitEvent('area', data);
        } else

        // Check if afk status changed
        if (match = line.match(REGEX.afk)) {
            data.autoReply = match[2];
            switch (match[1]) {
                case "ON":
                    data.isAfk = true;
                    break;
                case "OFF":
                    data.isAfk = false;
                    break;
            }

            self.emitEvent('afk', data);
        } else

        // Check if player leveled up
        if (match = line.match(REGEX.levelUp)) {
            data.name = match[1];
            data.characterClass = match[2];
            data.level = match[3];

            self.emitEvent('level', data);
        } else

        // Check if any message received
        if (match = line.match(REGEX.message)) {
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

            self.emitEvent('message', data);
        } else

        // Check if whisper received/sent
        if (match = line.match(REGEX.whisper)) {
            data.direction = match[1];
            data.guild = match[2];
            data.name = match[3];
            data.message = match[4];

            self.emitEvent('whisper', data);
        }
    });

    this.tail.on("error", function (error) {
        console.log('Tail has encountered an error: ', error);
    });
}

PathOfExileLog.prototype.emitEvent = function (event, data) {
    this.emit(event, data);
};

PathOfExileLog.prototype.start = function () {
    this.tail.watch();
    this.emit('start');
};

PathOfExileLog.prototype.pause = function () {
    this.tail.unwatch();
    this.emit('pause');
};

util.inherits(PathOfExileLog, events.EventEmitter);

module.exports = PathOfExileLog;
