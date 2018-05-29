var PathOfExileLog = require("poe-log-monitor");

var poeLog = new PathOfExileLog({
    logfile: "C:/Program Files (x86)/Steam/steamapps/common/Path of Exile/logs/Client.txt",
    interval: 500
});

// Listener for area events
poeLog.on("area", (area) => {
    // Display the area name
    process.stdout.write("Entered \'" + area.name + "\'");

    // If the area is a normal area...
    if(area.type === "area") {
        // If the area has additional information objects
        if (area.info.length > 0) {
            console.log(", this area has " + area.info.length + " variant/s:");

            // Iterate through every area variant
            area.info.forEach(function (area) {
                // Display area information
                process.stdout.write("\t- Act " + area.act + " (Zone level: " + area.level + ")");
                process.stdout.write(area.town ? " [Town]" : "");
                process.stdout.write(area.waypoint ? " [Waypoint]" : "");
                process.stdout.write(area.map ? " [Map Area]" : "");
                process.stdout.write(area.bosses.length ? " Has " + area.bosses.length + " unique monsters: " : "");

                // Display bosses, if there are any
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
    } else {
        process.stdout.write("\n");
    }
});