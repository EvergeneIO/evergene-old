const Discord = require("discord.js");
const { tools } = require("../classes/Bot.js");
const Bot = require("../classes/Bot.js");
const Embed = require("../classes/Embed.js");
const Tool = require("../classes/Tool.js");

/**
 * This will search for a role in the data and add/remove it
 * @author @CuzImStantac
 * @param {Discord.Message} msg the command message
 * @param {string} command the command
 * @async
 */
module.exports = new Tool(
  {
    name: "Handle Role",
    desc: "get or remove a certain role",
  },
  async function (msg, command) {
    const { roles } = Bot;

    //Find the role in json
    var role = Object.keys(roles).find(
      (r) => r.toLowerCase() == command.toLowerCase()
    );

    if (!role) return;

    //get role ID
    var roleID = roles[role];

    //check if role exists on the server
    var roleObj = msg.guild.roles.cache.get(roleID);
    if (!roleObj) {
      await msg.channel.send(
        new Embed()
          .prebuilt("error")
          .addToDescription(
            `Couldn't find the role! Please contact a team member.`
          )
      );
      return false;
    }

    //check if member has role
    if (msg.member.roles.cache.has(roleID)) {
      //remove Role
      msg.member.roles.remove(roleID);
      msg.channel.send(
        new Embed()
          .prebuilt("error")
          .addToDescription(`The role ${roleObj} has been removed!`)
      );
    } else {
      //add Role
      msg.member.roles.add(roleID);
      msg.channel.send(
        new Embed()
          .prebuilt("success")
          .addToDescription(`You got the role ${roleObj}!`)
      );
    }
    return true;
  }
);
