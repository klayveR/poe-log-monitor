var PathOfExileLog = require("poe-log-monitor");

var poeLog = new PathOfExileLog({
    logfile: "C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/Client.txt",
    interval: 500
});

poeLog.on("login", (data) => {
    console.log("Logged in. Gateway: " + data.server + ", Latency: " + data.latency);
});

poeLog.on("area", (data) => {
    console.log("Entered " + data.area);
});

poeLog.on("level", (data) => {
    console.log(data.name + " (" + data.characterClass + ") is now level " + data.level);
});

poeLog.on("deaths", (data) => {
    console.log("The death command was used, you died " + data.deaths + " times");
});

poeLog.on("remaining", (data) => {
    console.log("The remaining command was used, " + data.monsters + " monsters remain");
});

poeLog.on("afk", (data) => {
    console.log("AFK status is now " + data.status + ", auto reply is set to \'" + data.autoreply + "\'");
});

poeLog.on("dnd", (data) => {
    console.log("DND status is now " + data.status + ", auto reply is set to \'" + data.autoreply + "\'");
});

poeLog.on("joinChat", (data) => {
    console.log("Entered " + data.chat + " channel (" + data.channel + ") " + data.language);
});

poeLog.on("message", (data) => {
    console.log("(" + data.chat + ") " + data.name + ": " + data.message);
});

poeLog.on("whisper", (data) => {
    if(data.direction === "From") {
        console.log("You received a whisper from " + data.name + ": " + data.message);
    }
});