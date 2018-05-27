# poe-log-monitor
[![NPM version](https://img.shields.io/npm/v/poe-log-monitor.svg)](https://www.npmjs.com/package/poe-log-monitor)
[![NPM Downloads](https://img.shields.io/npm/dt/poe-log-monitor.svg)](https://www.npmjs.com/package/poe-log-monitor)
[![NPM License](https://img.shields.io/npm/l/poe-log-monitor.svg)](https://www.npmjs.com/package/poe-log-monitor)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7f4451528a46499cb7b297e3081e2188)](https://www.codacy.com/app/klayveR/poe-log-monitor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=klayveR/poe-log-monitor&amp;utm_campaign=Badge_Grade)

## Contents

- [Changelog](https://github.com/klayveR/poe-log-monitor/blob/master/CHANGELOG.md)
- [Getting Started](#getting-started)
- [Methods](#methods)
- [Events](#events)

## Getting Started
**Install with npm:**
```bash
$ npm install poe-log-monitor
```

**Usage:**
```javascript
var PathOfExileLog = require("poe-log-monitor");

var poeLog = new PathOfExileLog({
    logfile: "C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt"
});

poeLog.on("message", (data) => {
    console.log(data.player.name + " sent a message in " + data.chat + " chat: " + data.message);
});
```

## Methods

### Constructor([options])
- `options` - An optional object containing some of the following options
    - `logfile` - The path to Path of Exile's Client.txt
    	- default: `C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt`
    - `interval` - The interval, in milliseconds, to check for changes in the log file
    	- default: `1000`

Constructs a new `PathOfExileLog`. If the path to the log file is valid, the script will automatically start monitoring it. You can pause or resume monitoring using the `pause()` or `start()` method respectively.

### pause()
Pauses monitoring the logfile.

### start()
Resumes monitoring the logfile.

## Events

The parameters listed below each event are stored in an object emitted by the event.

### login
- `server` - The gateway the player logged into
- `latency` - The time, in milliseconds, it took to log in

Emitted when the player logs into the game.

### area
- `name` - The name of the area that has been entered
- `info` - An array of objects containing additional information about the area and their variants, if data is available (See `examples/area.js` for an example)

Emitted when the player enters an area.
>⚠ In the current version [1.2.0], only story areas have additional information. The other areas such as maps, hideouts and others will follow soon.

### joinChat
- `chat` - Chat which the player joined
- `channel` - Channel the player joined
- `language` - Language of the channel

Emitted when the player joins a chat channel.

### message
- `chat` - Chat in which the message appeared
    - Possible values: `global`, `trade`, `guild`, `party`, `local`
- `player`
    - `guild` - Guild tag of the player who sent the message, if present
    - `name` - Name of the player who sent the message
- `message` - Message the player sent

Emitted when a message appears in any of the active chat channels.

### whisper
- `direction` - Direction of the whispered message
    - Possible values: `To`, `From`
- `player`
    - `guild` - Guild tag of the player who sent the whisper, if present
    - `name` - Name of the player who sent the whisper
- `message` - Message the player sent

Emitted when a whisper is received or sent.

### death
- `name` - Name of the player that died

Emitted when the player dies.

### level
- `name` - Name of the player
- `characterClass` - Character class of the player
- `level` - Level of the player after level up

Emitted when the player levels up.

### trade
- `accepted` - `true` if the player accepted the trade

Emitted when the player finishes a trade.

### npcEncounter
- `name` - Name of the NPC
- `message` - Dialogue of the NPC

Emitted when when the player encounters a talking NPC in the wild.
>⚠ `Output Dialogue To Game` must be activated in the game UI options for this to work.    

>⚠ The list of supported NPCs is currently incomplete. Feel free to add NPCs that a player might encounter in the wild to the `resource/npc.json` file.

### masterEncounter
- `name` - Name of the Master
- `message` - Dialogue of the Master

Emitted when the player encounters a master in an area.
>⚠ `Output Dialogue To Game` must be activated in the game UI options for this to work

### afk
- `status` - `true` if the player is AFK
- `autoreply` - The auto reply set by the player

Emitted when the players AFK status changes.

### dnd
- `status` - `true` if the player enabled DND mode
- `autoreply` - The auto reply set by the player

Emitted when the players changes their DND mode status.

### deaths
- `deaths` - Times the player died

Emitted when the player uses the `/deaths` command in game.

### remaining
- `monsters` - The amount of remaining monsters in an area

Emitted when the player uses the `/remaining` command in game.

### age
- `days` - Days since the character has been created
- `hours` - Hours since the character has been created
- `minutes` - Minutes since the character has been created
- `seconds` - Seconds since the character has been created

Emitted when the player uses the `/age` command in game.

### played
- `days` - Days spent playing the character
- `hours` - Hours spent playing the character
- `minutes` - Minutes spent playing the character
- `seconds` - Seconds spent playing the character

Emitted when the player uses the `/played` command in game.

### start

Emitted when the script resumes monitoring the log file. This event emits no additional data.

### pause

Emitted when the script pauses monitoring the log file. This event emits no additional data.

[1.2.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.0
