var Tail = require("always-tail2");
var EventEmitter = require("events").EventEmitter;
var Events = require("./resource/events");
var Areas = require("./resource/areas");
var NPC = require("./resource/npc");
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
                if(event.hasOwnProperty("keys")) { // Assign eventKeys to matching groups
                    self.evalMatch(match, event.keys, eventName);
                } else if(event.hasOwnProperty("function")) { // Execute a function to further evaluate the matching data
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
}

// Pauses monitoring the log file
PathOfExileLog.prototype.pause = function () {
    this.tail.unwatch();
    this.emit("pause");
}

// This function simply puts match groups into a new object with the correct identifiers defined in the Events JSON and emits it
PathOfExileLog.prototype.evalMatch = function (match, eventKeys, event) {
    var data = {};

    for (var key in eventKeys) {
        if (!eventKeys.hasOwnProperty(key)) continue;

        // Check if the eventKeys should be in an additional object
        if(typeof eventKeys[key] === "object") {
            data[key] = {}; // Create new object in the data object

            // Iterate through each object key
            var nestedObject = eventKeys[key];
            for (var nestedKey in nestedObject) {
                if (!eventKeys[key].hasOwnProperty(nestedKey)) continue;

                var nestedMatchIndex = nestedObject[nestedKey];
                data[key][nestedKey] = match[nestedMatchIndex];
            }
        } else {
            var matchIndex = eventKeys[key];
            data[key] = match[matchIndex];
        }
    }

    this.emit(event, data);
}

// Area match
PathOfExileLog.prototype.evalArea = function (match) {
    var area = {};

    area.name = match[1] || "";
    area.info = [];

    // Determine AFK/DND status
    if(Areas.hasOwnProperty(match[1])) {
        area.info = Areas[match[1]];
    }

    this.emit("area", area);
}

// AFK/DND match
PathOfExileLog.prototype.evalAway = function (match) {
    var away = {};
    var type = match[1].toLowerCase();

    away.status = false;
    away.autoreply = match[3] || "";

    // Determine AFK/DND status
    if(typeof match[2] !== "undefined" && match[2] === "ON" ||
        typeof match[4] !== "undefined" && match[4] === "ON") {
        away.status = true;
    }

    this.emit(type, away);
}

// Message
PathOfExileLog.prototype.evalMessage = function (match) {
    var message = {};

    message.player = {};
    message.player.guild = match[2] || "";
    message.player.name = match[3] || "";
    message.message = match[4] || "";

    // Get chat
    if(typeof match[1] !== "undefined") {
        if(match[1] === "#") { message.chat = "global"; }
        else if(match[1] === "$") { message.chat = "trade"; }
        else if(match[1] === "&") { message.chat = "guild"; }
        else if(match[1] === "%") { message.chat = "party"; }
        else if(match[1] === "") {
            message.chat = "local";

            // If the chat is local, check if any of the NPC are talking
            if(NPC.masters.hasOwnProperty(message.player.name)) {
                this.evalMasterEncounter(message.player.name, message.message);
                return;
            } else if(NPC.npcs.hasOwnProperty(message.player.name)) {
                this.evalNpcDialogue(message.player.name, message.message);
                return;
            }
        }
    } else {
        message.chat = "";
    }

    this.emit("message", message);
}

PathOfExileLog.prototype.evalMasterEncounter = function (name, message) {
    var master = {};
    master.name = name;
    master.message = message;

    if(NPC.masters.hasOwnProperty(master.name)) {
        this.emit("masterEncounter", master);
    }
}

PathOfExileLog.prototype.evalNpcDialogue = function (name, message) {
    var npc = {};
    npc.name = name;
    npc.message = message;

    if(NPC.npcs.hasOwnProperty(npc.name)) {
        this.emit("npcEncounter", npc);
    }
}

util.inherits(PathOfExileLog, EventEmitter);

module.exports = PathOfExileLog;
