const PoeLog = require("poe-log-monitor");

let log = new PoeLog({
  "timestamps": true
});

let start = Date.now();

// Parse entire log, only include message and whispers
log.parseLog({ "events": ["area", "instanceServer"] })
.then((result) => {
  console.log(`Parsed ${result.length} events with readStream, ${Date.now() - start} ms`);
})
.catch((error) => {
  console.log(`Error parsing`, error);
});

// Start monitoring
log.start()
.then(() => {
  console.log(`Started monitoring`);
})
.catch((error) => {
  console.log(`Error starting monitoring`, error);
});

// Listen to message events and print them to console
log.on("message", (event) => {
  console.log(event);
});
