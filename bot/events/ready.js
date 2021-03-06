const Bot = require("../classes/Bot.js");
const Event = require("../classes/Event.js");
const Embed = require("../classes/Embed.js");

const moment = require("moment");

/**
 * Emitted when the client becomes ready to start working
 * @author @ACertainCoder @CuzImStantac
 */
module.exports = new Event(
  {
    name: "Ready",
    desc: "Der Bot ist bereit",
    type: Event.DISCORD,
  },
  async function () {
    const { client, config, tools, restart } = Bot;

    let date = Date.now();
    setTimeout(() => {
      new Embed('817546914781593650', 'Bot', Embed.STARTED, {
        webID: process.env.WEBHOOK_ID,
        webTOKEN: process.env.WEBHOOK_TOKEN
      }, `${process.cwd()}/actions/data/temp.txt`, date, process.env.APP_MODE);
    }, 1000);

    //Inform the user that the bot is logged in
    console.log(`${client.user.username} is ready!`);

    //Set the bot presence
    client.user.setPresence(config.presences.default);


    if (restart.done) {
      let delmsg = await client.channels.cache.get("813148581933482044").messages.fetch(Bot.ping);
      await delmsg.delete();
      let pingmsg = await client.channels.cache.get("813148581933482044").send("System restarted [<@&817532515644342292>]");
      Bot.ping = pingmsg.id;
      await tools.saveData.call();
    }

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
