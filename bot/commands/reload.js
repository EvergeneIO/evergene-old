const Bot = require("../classes/Bot.js");
const Command = require("../classes/Command.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");
const moment = require("moment");

/**
 * Reloads the bot
 * @author @ACertainCoder
 * @param {Discord.Message} msg Command message
 * @param {Array<string>} params Command parameters
 * @returns {Promise<any>} Command return value
 * @async
 */
module.exports = new Command(
  {
    name: "reload",
    aliases: ["rl"],
    desc: "Reloads the bot",
    perms: new Discord.Collection().set(
      "users",
      Object.values(Bot.config.devs)
    ),
  },
  async function (msg, params) {
    const { client, config, tools } = Bot;

    //Send the embed
    var embed1 = new Embed()
      .prebuilt("error", { author: false })
      .addToAuthor(` - ${this.name}`)
      .addToDescription(`Reloading . . .`);
    var message = await msg.channel.send(embed1);

    //Save the current time
    var reload = moment();

    //Run the bootup process again (without initialization)
    await tools.boot.call();

    //Get the time difference
    var time = moment
      .duration()
      .add(moment())
      .subtract(reload)
      .asMilliseconds();

    //Sleep for one second (protection against rate limiting)
    await tools.sleep.call(1000);

    //Edit the embed
    var embed2 = new Embed()
      .prebuilt("success", { author: false })
      .addToAuthor(` - ${this.name}`)
      .addToDescription(`Reload complete!`)
      .setFooter(`Time: ${time}ms`);
    await message.edit(embed2);
  }
);
