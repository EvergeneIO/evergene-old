const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");
const Event = require("../classes/Event.js");

/**
 * Registers all loaded events in the bot client
 * @author @ACertainCoder
 * @async
 */
module.exports = new Tool(
  {
    name: "Register Events",
    desc: "Registers all loaded events in the bot client",
  },
  async function () {
    const { client, args, events } = Bot;

    //Listen for new events (for debug purposes)
    client.on("newListener", (event, listener) => {
      if (args.debug) console.log(`Registered event "${event}"`);
    });

    //Loop through all loaded events
    for (let name of Object.keys(events)) {
      //Get event data
      let event = events[name];

      //Stop the bot if there isn't any data
      if (!event) {
        throw new Error(`Data missing (received "${typeof event}")`);
      }
      //Stop the bot if the event type is invalid
      if (typeof event.type != "number") {
        throw new Error(`Invalid event type (${typeof event.type})`);
      }

      //Register it
      if (args.debug) console.log(`Registering event "${event.name}"...`);
      switch (event.type) {
        //Process
        case Event.PROCESS:
          process.on(name, function () {
            if (args.debug) console.log(`Process triggered "${name}"`);
            events[name].apply(arguments);
          });
          break;
        //Discord
        case Event.DISCORD:
          client.on(name, function () {
            if (args.debug) console.log(`Client triggered "${name}"`);
            events[name].apply(arguments);
          });
          break;
        //Timeout
        case Event.TIMEOUT:
          let timeout = null;
          timeout = client.setTimeout(
            function () {
              if (args.debug) console.log(`Timeout triggered "${name}"`);
              //Will be cancelled automatically if the Discord client gets destroyed
              events[name].apply(arguments);
            },
            event.timeout,
            timeout
          );
          break;
        //Intervals
        case Event.INTERVAL:
          let interval = null;
          interval = client.setInterval(
            function () {
              if (args.debug) console.log(`Interval triggered "${name}"`);
              //Will be cancelled automatically if the Discord client gets destroyed
              events[name].apply(arguments);
            },
            event.interval,
            interval
          );
          break;
        //Unknown
        default:
          throw new Error(`Unknown event type (${event.type})`);
      }
    }
  }
);
