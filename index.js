var Tail = require("always-tail2");
var EventEmitter = require("events").EventEmitter;
var Events = require("./resource/events");
var Areas = require("./resource/areas");
var NPC = require("./resource/npc");
var util = require("util");
var fs = require("fs");
var async = require("async");

var LOGFILE = "C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt";
var INTERVAL = 1000;
var CHUNKSIZE = 1024;
var CHUNKINTERVAL = 1;

function PathOfExileLog(options) {
    options = options || {};

    EventEmitter.call(this);

    var self = this;
    this.logfile = options.logfile || LOGFILE;
    this.interval = options.interval || INTERVAL;
    this.includedEvents = options.includedEvents || Object.keys(Events);

    // Options for chunks when parsing the entire log
    this.chunkSize = options.chunkSize || CHUNKSIZE;
    this.chunkInterval = options.chunkInterval || CHUNKINTERVAL;

    // Check if the specified log file exists
    if (!fs.existsSync(this.logfile)) {
        this.emit("error", new Error("The specified log file \'" + this.logfile + "\' does not exist"));
        return;
    }

    this.tail = new Tail(this.logfile, "\n", { interval: this.interval });

    // If a new line appears in the log file...
    this.tail.on("line", function (line) {
        // Try matching the line with a regular expression from the Events JSON
        self.registerMatch(line);
    });

    this.tail.on("error", function (error) {
        self.emit("error", new Error("Tail has encountered an error: " + error));
    });
}

// Register the received line as a match and eval the result
PathOfExileLog.prototype.registerMatch = function (text) {
    var self = this;
    for (var i in self.includedEvents) {
        eventName = self.includedEvents[i];
        if (!Events.hasOwnProperty(eventName)) { continue; }
        var event = Events[eventName];
        var match = text.match(new RegExp(event.regex));
        if (match) {
            if (event.hasOwnProperty("properties")) { // Assign properties to matching groups
                self.evalMatch(match, event.properties, eventName);
            } else if (event.hasOwnProperty("function")) { // Execute a function to further evaluate the matching data
                // Check if the specified function is actually a function
                if (typeof self[event.function] === "function") {
                    self[event.function](match); // Execute specified function
                }
            }
            return;
        }
    }
}

// Reads the file and emits events for each included event
async function readLogStream(file, instance) {
    return new Promise(resolve => {
        var stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: instance.chunkSize });
        var hasStarted = false;
        // Split data into chunks so we dont stall the client
        stream.on('data', chunk => {
            if (!hasStarted) instance.emit("parsingStarted");
            hasStarted = true;
            var lines = chunk.toString().split("\n");
            // Pause stream until this chunk is completed to avoid spamming the thread
            stream.pause();
            async.each(lines, function (line, callback) {
                instance.registerMatch(line);
                callback();
            }, function (err) {
                setTimeout(() => {
                    stream.resume();
                }, instance.chunkInterval);
            });
        });
        stream.on('end', () => {
            instance.emit("parsingComplete");
            resolve();
            stream.close();
        });
    });
};

async function getLogData(file, instance) {
    await readLogStream(file, instance);
}

// Parse the entire log from the beginning
PathOfExileLog.prototype.parseLog = function () {
    var self = this;
    getLogData(this.logfile, self);
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
PathOfExileLog.prototype.evalMatch = function (match, properties, event) {
    var data = {};
    var timestampIndex = 1;
    var timestamp = match[timestampIndex];
    // Attach timestamp to data-object
    data.timestamp = timestamp;

    for (var key in properties) {

        if (!properties.hasOwnProperty(key)) { continue; }

        // Check if the properties should be in an additional object
        if (typeof properties[key] === "object") {
            data[key] = {}; // Create new object in the data object
            // Iterate through each object key
            var nestedObject = properties[key];
            for (var nestedKey in nestedObject) {
                if (!properties[key].hasOwnProperty(nestedKey)) { continue; }

                var nestedMatchIndex = nestedObject[nestedKey];
                data[key][nestedKey] = match[nestedMatchIndex+timestampIndex];
            }
        } else {
            var matchIndex = properties[key];
            data[key] = match[matchIndex+timestampIndex];
        }
    }

    this.emit(event, data);
};

// Area match
PathOfExileLog.prototype.evalArea = function (match) {
    var area = {};

    area.name = match[2] || "";
    area.type = "unknown";
    area.info = [];
    area.timestamp = match[1];

    // Iterate through each area type
    for (var areaType in Areas) {
        if (!Areas.hasOwnProperty(areaType)) { continue; }

        // Check if area has additional info in that area type, add to object if true
        if (typeof match[2] !== "undefined"
            && Areas[areaType].hasOwnProperty(match[2])) {
            area.type = areaType;
            area.info = Areas[areaType][match[2]];
        }
    }


    if (Areas.hasOwnProperty(match[2])) {
        area.info = Areas[match[2]];
    }

    this.emit("area", area);
};

// AFK/DND match
PathOfExileLog.prototype.evalAway = function (match) {
    var away = {};
    var type = match[2].toLowerCase();

    away.status = false;
    away.autoreply = match[4] || "";
    away.timestamp = match[1];

    // Determine AFK/DND status
    if (typeof match[3] !== "undefined" && match[3] === "ON"
        || typeof match[5] !== "undefined" && match[5] === "ON") {
        away.status = true;
    }

    this.emit(type, away);
};

// Message
PathOfExileLog.prototype.evalMessage = function (match) {
    var message = {};

    message.player = {};
    message.player.guild = match[3] || "";
    message.player.name = match[4] || "";
    message.message = match[5] || "";
    message.timestamp = match[1];

    // Get chat
    if (typeof match[2] !== "undefined") {
        if (match[2] === "#") { message.chat = "global"; }
        else if (match[2] === "$") { message.chat = "trade"; }
        else if (match[2] === "&") { message.chat = "guild"; }
        else if (match[2] === "%") { message.chat = "party"; }
        else if (match[2] === "") {
            message.chat = "local";

            // If the chat is local, check if any of the NPC are talking
            if (NPC.masters.hasOwnProperty(message.player.name)) {
                this.evalMasterEncounter(message.player.name, message.message, message.timestamp);
                return;
            } else if (NPC.npcs.hasOwnProperty(message.player.name)) {
                this.evalNpcDialogue(message.player.name, message.message, message.timestamp);
                return;
            }
        }
    } else {
        message.chat = "";
    }

    this.emit("message", message);
};

PathOfExileLog.prototype.evalTrade = function (match) {
    var trade = {};
    trade.accepted = false;
    trade.timestamp = match[1];

    if (typeof match[2] !== "undefined" && match[2] === "accepted") {
        trade.accepted = true;
    }

    this.emit("trade", trade);
};

PathOfExileLog.prototype.evalMasterEncounter = function (name, message, timestamp) {
    var master = {};
    master.name = name;
    master.message = message;
    master.timestamp = timestamp;

    if (NPC.masters.hasOwnProperty(master.name)) {
        this.emit("masterEncounter", master);
    }
};

PathOfExileLog.prototype.evalNpcDialogue = function (name, message, timestamp) {
    var npc = {};
    npc.name = name;
    npc.message = message;
    npc.timestamp = timestamp;

    if (NPC.npcs.hasOwnProperty(npc.name)) {
        this.emit("npcEncounter", npc);
    }
};

util.inherits(PathOfExileLog, EventEmitter);

module.exports = PathOfExileLog;