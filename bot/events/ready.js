const Bot = require("../classes/Bot.js");
const Event = require("../classes/Event.js");
const Embed = require("../classes/Embed.js");

const moment = require("moment");

/**
 * Emitted when the client becomes ready to start working
 * @author @ACertainCoder
 */
module.exports = new Event(
  {
    name: "Ready",
    desc: "Der Bot ist bereit",
    type: Event.DISCORD,
  },
  async function () {
    const { client, config, tools, restart } = Bot;

    //Inform the user that the bot is logged in
    console.log(`${client.user.username} is ready!`);

    //Set the bot presence
    client.user.setPresence(config.presences.default);

    //Edit the restart message (if there is one)
    if (!restart.done && restart.guild && restart.channel && restart.message) {
      //Find the restart message
      var message = await client.guilds.cache
        .get(restart.guild)
        .channels.cache.get(restart.channel)
        .messages.fetch(restart.message);

      //Get the time difference
      var time = moment
        .duration()
        .add(moment())
        .subtract(moment(restart.time))
        .format();

      //Edit the embed
      var embed = new Embed()
        .prebuilt("success", { author: false })
        .addToAuthor(" - Restart")
        .addToDescription(`Restart complete!`)
        .setFooter(`Time: ${time}`);
      await message.edit(embed);

      //Save needed data
      Bot.restart.done = true;
      await tools.saveData.call();
    }
  }
);
