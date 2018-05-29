## Area event

- [Properties](#properties)
- [Area information format](#area-information-format)
- [Usage example](#usage-example)

## Properties
The properties listed below are stored in an object emitted by the `area` event.

- `name` 
    - The name of the area that has been entered
- `type` 
    - The type of the area
        - `area` - Regular areas, such as act areas or hideouts
        - `vaal` - Vaal side areas
        - `map` - Map areas *(currently unused)*
        - `labyrinth` - Labyrinth areas *(currently unused)*
        - `unknown` - Areas of this type are currently unknown by the script
- `info` 
    - An array of objects containing additional information about the area and their variants, if data is available. The emitted object has a different format based on the `type`. See [Area information format](#area-information-format).
    
        >⚠ In the current version [1.2.2], only story, hideout and vaal side areas have additional information. All the other areas will follow shortly.

## Area information format
The `info` object always contains an array of objects, because some areas have different properties, but the same name (this is usually only the case for story areas). Currently, it is not possible to get the exact area the player is in based on the Path of Exile log file, so the script just gives you every possible variant.

The `info` object has different formats based on the area `type`. Below, you can find a list of those formats of each area `type`.

>⚠ These formats are subject to change. Please make sure to come back to this file if you plan on updating this module, in case there have been any changes.

### `area`
- `act` - Act the area is in
- `level` - Zone/monster level of the area
- `town` - `true` if the area is a town
- `waypoint` - `true` if the area has a waypoint
- `bosses` - An array of objects containing the name of the boss
    - `name` - Name of the boss
            
### `vaal`
- `bosses` - An array of objects containing additional information for each boss in the area
    - `name` - Name of the boss
            
### `labyrinth`
- *There's no data for this area type yet, I'll add the data as soon as possible.*
            
### `map`
- *There's no data for this area type yet, I'll add the data as soon as possible.*

### `unknown`
- Areas of this type are currently unknown by the script. They will emit no additional data in the `info` object.
    
In case all this doesn't make any sense to you, simply print out the `info` object you receive when the event triggers and see what it contains. Alternatively, you can take a look at the [areas.json].
    
## Usage example
Below, you can find an example that prints additional information of areas with the `area` type to the console, once you enter it in game ([area.js])

```javascript
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
```

[areas.json]: https://github.com/klayveR/poe-log-monitor/blob/master/resource/areas.json
[area.js]: https://github.com/klayveR/poe-log-monitor/blob/master/examples/area.js
[1.2.2]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.2