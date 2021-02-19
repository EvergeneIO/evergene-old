const Bot = require("../classes/Bot.js");
const Event = require("../classes/Event.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");
const moment = require("moment");

/**
 * Emitted whenever a message is created
 * @author @ACertainCoder @CuzImStantac
 * @param {Discord.Message} msg Message
 */
module.exports = new Event(
  {
    name: "Message",
    desc: "Message received",
    type: Event.DISCORD,
  },
  async function (msg) {
    const { config, commands, tools } = Bot;

    //Check if it isn't alright to execute a command
    if (msg.channel.type == "dm" || msg.author.bot) return;
    if (!Object.values(config.devs).includes(msg.author.id)) {
      if (
        !Object.values(config.servers)
          .map((s) => s.id)
          .includes(msg.guild.id)
      ) {
        if (msg.author.id != client.user.id && Bot._args.debug) {
          console.log(
            `${msg.author.tag} (${msg.author.id}) executed the "${this.name}" event on ${msg.guild.name} (${msg.guild.id})`
          );
        }
        return;
      }
    }

    //Find the command name and get other parameters
    const { command, params, mention } = await tools.findCommand.call(
      msg.content
    );

    if (command) {
      //Find a matching command
      var data = Object.values(commands).filter((c) => {
        //Name
        var name = c.name.toLowerCase() == command.toLowerCase();
        //Aliases
        var aliases = c.aliases
          ? c.aliases.filter((a) => a.toLowerCase() == command.toLowerCase())
          : null;

        return name || (aliases && aliases.length > 0);
      });
      //If commands have been found, use the first one
      if (data.length > 0) {
        data = data[0];
      } else {
        await tools.handleRole.call(msg, command);
        return;
      }

      //Check if the user is allowed to execute the command in this environment
      if (data.hasPerms(msg)) {
        //Check if the user has no cooldown at this command
        if (!data.hasCooldown(msg.author.id)) {
          //If so, execute the command
          try {
            await data.call(msg, params);
          } catch (e) {
            console.trace(
              `Failed to start the command execution of "${data.name}"`
            );
          }
        } else {
          //Otherwise, inform the user that they need to wait
          var cooldown = moment
            .duration()
            .add(
              moment(data.executions[msg.author.id]).add(
                data.cooldown,
                "milliseconds"
              )
            )
            .subtract(moment())
            .format();

          var embed = new Embed()
            .prebuilt("load")
            .addToDescription(`Cooldown active! Please wait **${cooldown}**.`);
          await msg.channel.send(embed);
        }
      } else {
        //Inform the user about the missing permissions
        var embed = new Embed()
          .prebuilt("error")
          .addToDescription("Missing permissions!");
        await msg.channel.send(embed);
      }
    } else if (mention) {
      Object.values(commands)
        .find((c) => c.name.toLowerCase() == "help")
        .call(msg, params);
    }
  }
);
