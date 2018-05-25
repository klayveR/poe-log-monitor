# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [1.1.1] - 2018-05-25
### Added
- The following events have been added
    - `remaining` emits when the player uses the `/remaining` command in game
    
### Changes
- Eliminated the use of `undefined` in code
- Methods that simply renamed match groups and emitted them as a new object are now handled in a single method (events which require additional evaluation of the data are still in separate functions)
- Events as well as their corresponding regular expressions and functions/group names are now stored in a JSON file

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

[1.1.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.1.0
[1.0.1]: https://www.npmjs.com/package/poe-log-monitor/v/1.0.1
[1.0.0]: https://www.npmjs.com/package/poe-log-monitor/v/1.0.0