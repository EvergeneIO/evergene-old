const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");

const Discord = require("discord.js");
const fs = require("fs");

/**
 * This will load every file the bot needs to run properly and login the client
 * @author @ACertainCoder
 * @param {boolean} init Run the initialization
 * @async
 */
module.exports = new Tool(
  {
    name: "Boot",
    desc: "Loads the bot and login the client",
  },
  async function (init = false) {
    const { cwd } = Bot;

    //Validate arguments
    if (typeof init != "boolean") {
      throw new Error(`Expected a boolean but received "${typeof init}"`);
    }

    //Parse console arguments
    if (init) {
      for (var i = 2; i < process.argv.length; i++) {
        switch (process.argv[i].toLowerCase()) {
          //Debug
          case "--debug":
          case "-d":
            Bot.args.debug = true;
            break;

          //Unknown
          default:
            console.error(`Unknown argument "${process.argv[i]}"`);
            break;
        }
      }
    }

    //Warn if the bot is in debug mode
    if (Bot.args.debug && init) console.log("--------DEBUG MODE--------");

    //Load the configuration
    var configuration = `${cwd}/${Bot.args.debug ? "debug" : "config"}.json`;
    if (fs.existsSync(configuration)) {
      console.log("Loading configuration");
      Bot.config = JSON.parse(fs.readFileSync(configuration));
    } else {
      throw new Error("Config missing");
    }

    Bot.config.prefix = process.env.PREFIX;
    if(!Bot.args.debug) Bot.config.token = process.env.TOKEN;

    //Load commands, events and tools
    ["commands", "events", "tools"].forEach((type) => {
      if (fs.existsSync(`${cwd}/${type}`)) {
        console.log(`Loading ${type}`);

        //Check if no data exists
        if (!Bot[type]) {
          //Create an object to store the data
          Bot[type] = {};
        }

        //Loop through the directory
        fs.readdirSync(`${cwd}/${type}`).forEach((file) => {
          //Filename without file extension
          var name = file.slice(0, file.lastIndexOf("."));
          //Delete require cache (if existent)
          try {
            delete require.cache[require.resolve(`${cwd}/${type}/${file}`)];
          } catch (e) {}

          //Load file
          try {
            if (Bot.args.debug) console.log(`Loading "${file}"...`);
            Bot[type][name] = require(`${cwd}/${type}/${file}`);
          } catch (e) {
            if (Bot.args.debug) console.log(`Failed to load "${file}"!`);
            console.error(e);
          }
        });
      } else {
        throw new Error(`Directory missing: "${type}"`);
      }
    });

    //Load data inside the data folder
    await Bot.tools.loadData.call();

    //Initialize the bot
    if (init) {
      //Extend libraries
      if (Bot.args.debug) console.log("Extending Libraries");
      await Bot.tools.extendLibraries.call();

      //Create the client
      Bot.client = new Discord.Client();

      //Register events
      if (Bot.args.debug) console.log("Registering events");
      await Bot.tools.registerEvents.call();

      //Log in the client
      if (Bot.args.debug) console.log("Bot is logging in");
      await Bot.client.login(Bot.config.token);
    }
  }
);
