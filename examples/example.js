var PathOfExileLog = require("poe-log-monitor");

var poeLog = new PathOfExileLog({
    logfile: "C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/Client.txt",
    interval: 500
});

poeLog.on("login", (data) => {
    console.log("Logged in. Gateway: " + data.server + ", Latency: " + data.latency);
});

poeLog.on("area", (area) => {
    console.log("Entered \'" + area.name + "\'");
});

poeLog.on("level", (player) => {
    console.log(player.name + " (" + player.characterClass + ") is now level " + player.level);
});

poeLog.on("death", (player) => {
    console.log(player.name + " has been slain");
});

poeLog.on("deaths", (data) => {
    console.log("The death command was used, you died " + data.deaths + " times");
});

poeLog.on("trade", (trade) => {
    console.log("A trade has been detected, you", trade.accepted ? "accepted" : "cancelled", "it");
});

poeLog.on("remaining", (remaining) => {
    console.log("The remaining command was used, " + remaining.monsters + " monsters remain");
});

poeLog.on("age", (age) => {
    console.log("Your character was created " + age.days + " days ago");
});

poeLog.on("played", (played) => {
    console.log("You have played for " + played.days + " days and " + played.hours + " hours");
});

poeLog.on("afk", (afk) => {
    console.log("AFK status is now " + afk.status + ", auto reply is set to \'" + afk.autoreply + "\'");
});

poeLog.on("dnd", (dnd) => {
    console.log("DND status is now " + dnd.status + ", auto reply is set to \'" + dnd.autoreply + "\'");
});

poeLog.on("joinChat", (chat) => {
    console.log("Entered " + chat.chat + " channel (" + chat.channel + ") " + chat.language);
});

poeLog.on("npcEncounter", (npc) => {
    console.log("NPC " + npc.name + " encountered: \'" + npc.message + "\'");
});

poeLog.on("masterEncounter", (master) => {
    console.log("Master " + master.name + " encountered: \'" + master.message + "\'");
});

poeLog.on("message", (message) => {
    console.log("(" + message.chat + ") " + message.player.name + ": " + message.message);
});

poeLog.on("whisper", (whisper) => {
    if(whisper.direction === "From") {
        console.log("You received a whisper from " + whisper.player.name + ": " + whisper.message);
    }
});