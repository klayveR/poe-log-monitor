# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [1.2.5] - 2018-11-21
### Added
- Functionality to parse the entire log from the beginning has been added
- Added timestamps to all current events, as a separate regex group that can be used. Useful for comparing timestamps when parsing the entire log.
- The following inputs have been added
    - `includedEvents` specifies the events that should be used. By default it includes all events specified in Events.json.
    - `chunkSize` determines the chunksize when parsing the entire log. 
    - `chunkInterval` specifies the interval at which the parser will chunk data. Can be delayed if slower parsing is accepted, in cases where it would otherwhise affect performance.
- The following events have been added
    - `parsingStarted` emits when the parsing of the file has started.
    - `parsingComplete` emits when the parsing of the file has completed. 

### Changes
- Wrapped regex-matching in a new function called `registerMatch`.

### Fixed
- Fixed some areas that had incorrectly formatted boss-arrays.

## [1.2.4] - 2018-07-10
### Added
- The following events have been added
    - `instanceServer` emits when the player joins a new instance server. This can be useful for determining whether a player enters an area instance the player previously entered, or a newly created one.
- Added `info` data for map areas

### Changes
- Normalized boss data for all areas

*Thanks to [petterannerwall](https://github.com/petterannerwall) for these improvements. Go check out his fantastic project [ExileParty](https://github.com/viktorgullmark/exile-party)!*

## [1.2.3] - 2018-05-31
### Added
- The following events have been added
    - `areaJoin` emits when another player joins the area the player is in
    - `areaLeave` emits when another player leaves the area the player is in
- Added labyrinth trials and the Aspirants' plaza to the `labyrinth` areas

## [1.2.2] - 2018-05-29
### Added
- The object emitted by the `area` event now has an additional property `type`
- Vaal side areas and hideouts have been added to known areas
- Added [AREA.md](https://github.com/klayveR/poe-log-monitor/blob/master/AREA.md) for more detailed information about the `area` event

### Removed
- Areas of the `area` type have had the `map` property removed from the `info` object

## [1.2.1] - 2018-05-27
### Added
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
- The `name` and `guild` properties of the `message` and `whisper` event are now stored in the `player` object
- The `area` property of the `area` event is now `name`

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
- The `isAfk` property of the `afk` event is now `status`
- The `autoReply` property of the `afk` event is now `autoreply`
- The `channel` property of the `message` event is now `chat`

### Fixed
- Fixed a bug that would not include the `isAfk` (now `status`) value in the event object when the AFK status changed to `OFF`
- The `autoreply` property is no longer `undefined` if the player isn't AFK or in DND mode

## [1.0.1] - 2018-05-23
### Changes
- Moved each event into separate functions

## [1.0.0] - 2018-05-23
### Added
- Initial release

[1.2.4]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.4
[1.2.3]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.3
[1.2.2]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.2
[1.2.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.1
[1.2.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.2.0
[1.1.2]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.2
[1.1.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.1
[1.1.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.0
[1.0.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.0.1
[1.0.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.0.0