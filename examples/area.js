var PathOfExileLog = require("poe-log-monitor");

var poeLog = new PathOfExileLog({
    logfile: "C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/Client.txt",
    interval: 500
});

poeLog.on("area", (area) => {
    process.stdout.write("Entered \'" + area.name + "\'");

    if(area.info.length > 0) {
        console.log(", this area has " + area.info.length + " variant/s:");
        area.info.forEach(function (area) {
            process.stdout.write("\t- Act " + area.act + " (Zone level: " + area.level + ")");
            process.stdout.write(area.town ? " [Town]" : "");
            process.stdout.write(area.waypoint ? " [Waypoint]" : "");
            process.stdout.write(area.map ? " [Map Area]" : "");
            process.stdout.write(area.bosses.length ? " Has " + area.bosses.length + " unique monsters: " : "");

            if (area.bosses.length > 0) {
                area.bosses.forEach(function (boss) {
                    process.stdout.write("\'" + boss.name + "\' ");
                });
            }

            process.stdout.write("\n");
        });
    } else {
        process.stdout.write("\n");
    }
});