const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");
const Event = require("../classes/Event.js");
const Command = require("../classes/Command.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const util = require("util");
const path = require("path");
const fs = require("fs");

/**
 * Evaluate JavaScript-Code inside of Discord
 * @author @ACertainCoder @CuzImStantac
 * @param {Discord.Message} msg Command message
 * @param {Array<string>} params Command parameters
 * @returns {Promise<any>} Command return value
 * @async
 */
module.exports = new Command(
  {
    name: "eval",
    aliases: ["e", "js", "script"],
    desc: "Execute JavaScript Code",
    usage: "[Code]",
    perms: new Discord.Collection().set(
      "users",
      Object.values(Bot.config.devs)
    ),
  },
  async function (msg, params) {
    const { client, config, commands, events, tools, cwd, args } = Bot;

    //Check if the command author hasn't specified something
    if (params.length == 0) {
      //Send the default embed
      var embed = new Embed()
        .prebuilt("error")
        .addToDescription("Please provide a JavaScript code!");

      await msg.channel.send(embed);
      return;
    }

    //Create evaluation data
    const evaluationData = {
      input: params.join(" "),
      output: null,
      type: null,
      start: null,
      end: null,
      time: null,
      embed: null,
    };

    //Evaluation
    evaluationData.start = moment();
    try {
      evaluationData.output = eval(evaluationData.input);
    } catch (error) {
      //Check if the error is valid
      if (error.name) {
        evaluationData.type = error.name;

        //Inspect the error if the bot owner executed the command
        if (msg.author.id == config.devs["CuzImStantac#6239"]) {
          evaluationData.output = util
            .inspect(error, { depth: null })
            .slice(error.name.length + 2);
        } else {
          evaluationData.output = error.message;
        }
      } else {
        evaluationData.type = "Error";

        //Inspect the error if the bot owner executed the command
        if (msg.author.id == config.devs["CuzImStantac#6239"]) {
          evaluationData.output = util.inspect(error, { depth: null });
        } else {
          evaluationData.output = "Unknown Error";
        }
      }
    }
    evaluationData.end = moment();

    //Subtract the start moment from the end moment to get the amount of milliseconds, it took
    evaluationData.time = moment
      .duration()
      .add(evaluationData.end)
      .subtract(evaluationData.start)
      .asMilliseconds();

    //If the evaluation was successful, check the output type and convert the output itself into a readable text if needed
    if (!evaluationData.type) {
      switch (typeof evaluationData.output) {
        //Object
        case "object":
          if (evaluationData.output !== null) {
            evaluationData.type = Object.getPrototypeOf(
              evaluationData.output
            ).constructor.name;
          } else {
            evaluationData.type = "NULL";
          }
          evaluationData.output = util.inspect(evaluationData.output, {
            depth: 1,
          });
          break;
        //Function
        case "function":
          evaluationData.type = "Function";
          evaluationData.output = evaluationData.output.toString();
          break;
        //Boolean
        case "boolean":
          evaluationData.type = "Boolean";
        //String
        case "string":
          evaluationData.type = "String";
          break;
        //Number
        case "number":
          evaluationData.type = "Number";
          break;
        //Symbol
        case "symbol":
          evaluationData.type = "Symbol";
        //Other
        default:
          evaluationData.type = typeof evaluationData.output;
          evaluationData.output = new String(evaluationData.output);
          break;
      }
    }

    //Check if the text is too long to display in Discord
    if (evaluationData.output.length > 1500) {
      //Slice it if needed
      evaluationData.output = evaluationData.output.slice(0, 1500) + "\n...";
    }

    if (evaluationData.input.length > 1500) {
      //Slice it if needed
      evaluationData.input = evaluationData.input.slice(0, 1500) + "\n...";
    }

    //Display the result in Discord
    evaluationData.embed = new Embed()
      .addToAuthor(` - ${this.name}`)
      .addField("Input:", "```js\n" + evaluationData.input + "\n```")
      .addField("Output:", "```js\n" + evaluationData.output + "\n```")
      .addField("Type:", "```js\n" + evaluationData.type + "\n```")
      .setFooter(
        `Evaluated by ${msg.author.tag} • Time: ${evaluationData.time} ms`
      );
    await msg.channel.send(evaluationData.embed);
  }
);
