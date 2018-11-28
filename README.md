# poe-log-monitor
[![NPM version](https://img.shields.io/npm/v/poe-log-monitor.svg)](https://www.npmjs.com/package/poe-log-monitor)
[![NPM Downloads](https://img.shields.io/npm/dt/poe-log-monitor.svg)](https://www.npmjs.com/package/poe-log-monitor)
[![NPM License](https://img.shields.io/npm/l/poe-log-monitor.svg)](https://www.npmjs.com/package/poe-log-monitor)

## Getting Started
**Install with npm:**
```bash
$ npm install poe-log-monitor
```

**Integration:**
```javascript
const PoeLog = require("poe-log-monitor");
```

<a name="PoeLog"></a>

## PoeLog
**Kind**: global class  

* [PoeLog](#PoeLog)
    * [new PoeLog([options])](#new_PoeLog_new)
    * [.start()](#PoeLog+start) ⇒ <code>Promise</code>
    * [.stop()](#PoeLog+stop)
    * [.getEvents()](#PoeLog+getEvents) ⇒ <code>Array</code>
    * [.parseLog([options])](#PoeLog+parseLog) ⇒ <code>Promise.&lt;Array&gt;</code>
    * ["error"](#PoeLog+event_error)
    * ["age"](#PoeLog+event_age)
    * ["areaAction"](#PoeLog+event_areaAction)
    * ["area"](#PoeLog+event_area)
    * ["away"](#PoeLog+event_away)
    * ["death"](#PoeLog+event_death)
    * ["deaths"](#PoeLog+event_deaths)
    * ["instanceServer"](#PoeLog+event_instanceServer)
    * ["joinChat"](#PoeLog+event_joinChat)
    * ["level"](#PoeLog+event_level)
    * ["login"](#PoeLog+event_login)
    * ["message"](#PoeLog+event_message)
    * ["played"](#PoeLog+event_played)
    * ["remaining"](#PoeLog+event_remaining)
    * ["trade"](#PoeLog+event_trade)
    * ["whisper"](#PoeLog+event_whisper)

<a name="new_PoeLog_new"></a>

### new PoeLog([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | An optional parameter object |
| [options.logfile] | <code>string</code> | <code>&quot;C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt&quot;</code> | Path to `Client.txt` log file |
| [options.timestamps] | <code>boolean</code> | <code>true</code> | Adds timestamps to events |

<a name="PoeLog+start"></a>

### poeLog.start() ⇒ <code>Promise</code>
Starts monitoring the Path of Exile log file

**Kind**: instance method of [<code>PoeLog</code>](#PoeLog)  
<a name="PoeLog+stop"></a>

### poeLog.stop()
Stops monitoring the Path of Exile log file

**Kind**: instance method of [<code>PoeLog</code>](#PoeLog)  
<a name="PoeLog+getEvents"></a>

### poeLog.getEvents() ⇒ <code>Array</code>
Returns the full list of events

**Kind**: instance method of [<code>PoeLog</code>](#PoeLog)  
<a name="PoeLog+parseLog"></a>

### poeLog.parseLog([options]) ⇒ <code>Promise.&lt;Array&gt;</code>
Parses the entire `Client.txt` and returns the events in an array utilizing a read stream

**Kind**: instance method of [<code>PoeLog</code>](#PoeLog)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | An optional parameter object |
| [options.events] | <code>Array</code> | <code>All events</code> | An array containing the events that should be included |

<a name="PoeLog+event_error"></a>

### "error"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
<a name="PoeLog+event_age"></a>

### "age"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| days | <code>number</code> | 
| hours | <code>number</code> | 
| minutes | <code>number</code> | 
| seconds | <code>number</code> | 
| totalSeconds | <code>number</code> | 

<a name="PoeLog+event_areaAction"></a>

### "areaAction"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address | <code>string</code> |  |
| player.name | <code>string</code> |  |
| action | <code>string</code> | `leave`, `join` |

<a name="PoeLog+event_area"></a>

### "area"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| type | <code>string</code> | 
| info | <code>string</code> | 

<a name="PoeLog+event_away"></a>

### "away"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| type | <code>string</code> | 
| status | <code>boolean</code> | 
| autoreply | <code>string</code> | 

<a name="PoeLog+event_death"></a>

### "death"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| player.name | <code>string</code> | 

<a name="PoeLog+event_deaths"></a>

### "deaths"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| deaths | <code>number</code> | 

<a name="PoeLog+event_instanceServer"></a>

### "instanceServer"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="PoeLog+event_joinChat"></a>

### "joinChat"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| chat | <code>string</code> | `global`, `local`, `trade`, `guild`, `party` |
| channel | <code>number</code> |  |
| language | <code>string</code> |  |

<a name="PoeLog+event_level"></a>

### "level"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| player.name | <code>string</code> | 
| player.class | <code>string</code> | 
| player.level | <code>number</code> | 

<a name="PoeLog+event_login"></a>

### "login"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| address | <code>string</code> | 
| latency | <code>number</code> | 

<a name="PoeLog+event_message"></a>

### "message"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| chat | <code>string</code> | `global`, `local`, `trade`, `guild`, `party` |
| player.guild | <code>string</code> |  |
| player.name | <code>string</code> |  |
| text | <code>string</code> |  |

<a name="PoeLog+event_played"></a>

### "played"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| days | <code>number</code> | 
| hours | <code>number</code> | 
| minutes | <code>number</code> | 
| seconds | <code>number</code> | 
| totalSeconds | <code>number</code> | 

<a name="PoeLog+event_remaining"></a>

### "remaining"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| remaining | <code>number</code> | 

<a name="PoeLog+event_trade"></a>

### "trade"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type |
| --- | --- |
| accepted | <code>boolean</code> | 

<a name="PoeLog+event_whisper"></a>

### "whisper"
**Kind**: event emitted by [<code>PoeLog</code>](#PoeLog)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| direction | <code>string</code> | `To`, `From` |
| player.guild | <code>string</code> |  |
| player.name | <code>string</code> |  |
| message | <code>string</code> |  |

