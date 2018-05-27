# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [1.2.1] - 2018-05-27
- The following events have been added
    - `trade` emits when the player accepts or cancels a trade
    
## [1.2.0] - 2018-05-27
### Added
- The following events have been added
    - `npcEncounter` emits when the player encounters a talking NPC in the wild
    - `masterEncounter` emits when the player encounters a master in an area
    >⚠ `Output Dialogue To Game` must be activated in the game UI options for these two events to work
- The `area` event now emits additional area data (`info`) if data matching the area name is found in the `areas.json`. `info` is an array which can currently contain up to two objects holding area information for different variants of the area (take Lioneye's Watch for example, which has an area in Act 1 and Act 6).
- Added an example for the new `info` object which can be found in the `examples` folder

### Changes
- The `name` and `guild` elements of the `message` and `whisper` event are now stored in the `player` object
- The `area` element of the `area` event is now `name`

### Fixed
- Fixed a bug that caused the DND/AFK status to always be false
- Fixed the regular expression for the `remaining` event, it'll now also emit when there's more than 50 monsters in the area

## [1.1.2] - 2018-05-26
### Added
- The following events have been added
    - `death` emits when the player dies
    - `played` emits when the player uses the `/played` command in game
    - `age` emits when the player uses the `/age` command in game

### Fixed
- The script now prevents executing not defined functions specified in `events.json`

## [1.1.1] - 2018-05-25
### Added
- The following events have been added
    - `remaining` emits when the player uses the `/remaining` command in game
    
### Changes
- Eliminated the use of `undefined` in code
- Methods that simply renamed match groups and emitted them as a new object are now handled in a single method (events which require additional evaluation of the data are still in separate functions)
- Events as well as their corresponding regular expressions and functions/group names are now stored in `events.json`

## [1.1.0] - 2018-05-25
### Added
- The following events have been added
    - `login` emits when the player logs into the game
    - `deaths` emits when the player uses the `/deaths` command in game
    - `joinChat` emits when the player joins a chat channel
    - `dnd` emits when the player changes their DND status
- Added an example on GitHub

### Changed
- The `isAfk` element name of the `afk` event is now `status`
- The `autoReply` element name of the `afk` event is now `autoreply`
- The `channel` element name of the `message` event is now `chat`

### Fixed
- Fixed a bug that would not include the `isAfk` (now `status`) value in the event object when the AFK status changed to `OFF`
- The `autoreply` element is no longer `undefined` if the player isn't AFK or in DND mode

## [1.0.1] - 2018-05-23
### Changes
- Moved each event into separate functions

## [1.0.0] - 2018-05-23
### Added
- Initial release

[1.2.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.1
[1.2.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.0
[1.1.2]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.2
[1.1.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.1
[1.1.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.0
[1.0.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.0.1
[1.0.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.0.0