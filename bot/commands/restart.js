const Bot = require("../classes/Bot.js");
const Command = require("../classes/Command.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");
const moment = require("moment");

/**
 * Restarts the bot
 * @author @ACertainCoder
 * @param {Discord.Message} msg Command message
 * @param {Array<string>} params Command parameters
 * @returns {Promise<any>} Command return value
 * @async
 */
module.exports = new Command(
  {
    name: "restart",
    aliases: ["rs"],
    desc: "Restarts the bot",
    perms: new Discord.Collection().set(
      "users",
      Object.values(Bot.config.devs)
    ),
  },
  async function (msg, params) {
    const { client, config, tools } = Bot;

    //Send the embed
    var embed = new Embed()
      .prebuilt("error", { author: false })
      .addToAuthor(` - ${this.name}`)
      .addToDescription(`Restarting . . .`);
    var message = await msg.channel.send(embed);

    //Save needed data
    Bot.restart = {
      guild: message.guild.id,
      channel: message.channel.id,
      message: message.id,
      time: moment().toISOString(),
      done: false,
    };
    try {
      await tools.saveData.call();
    } catch (e) {
      //Log Discord errors into the console
      console.error(e);
    }

    //Stop the bot
    client.destroy();
    process.exit();
  }
);
