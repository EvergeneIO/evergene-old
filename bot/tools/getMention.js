const Tool = require("../classes/Tool.js");

const Discord = require("discord.js");

/**
 * This will check if the selected param contains a valid mention and return it if so
 * @author @CuzImStantac
 * @param {string} type Mention type (channels, members, roles, users)
 * @param {number} index Parameter list index
 * @param {Discord.Message} msg Message
 * @param {Array<string>} params Parameters
 * @returns {Discord.Channel | Discord.GuildMember | Discord.Role | Discord.User} Mention
 * @async
 */
module.exports = new Tool(
  {
    name: "Get Mention",
    desc:
      "This will check if the selected param contains a valid mention and return it if so",
  },
  async function (type, index, msg, params) {
    //Validate arguments
    if (typeof type != "string") {
      throw new Error(`Expected a string but received "${typeof type}"`);
    }
    if (!["channel", "members", "roles", "users"].includes(type)) {
      throw new Error("Invalid mention type");
    }
    if (typeof index != "number") {
      throw new Error(`Expected a number but received "${typeof index}"`);
    }
    if (!(msg instanceof Discord.Message)) {
      throw new Error(
        `Expected a Discord message but received "${typeof msg}"`
      );
    }
    if (!(params instanceof Array)) {
      throw new Error(`Expected an array but received "${typeof params}"`);
    }

    //Mention
    var mention = null;

    if (params.length > index) {
      switch (type) {
        case "channels":
          //get channel param
          let channel = params[index];

          //slice param to get id
          if (channel.startsWith("<#") && channel.endsWith(">"))
            channel = channel.slice(2, -1);

          //if channel set mention to channel
          if (channel) mention = channel;
          break;
        case "roles":
          //get role param
          let role = params[index];

          //slice param to get id
          if (role.startsWith("<@&") && role.endsWith(">"))
            role = role.slice(3, -1);

          //if role set mention to role
          if (role) mention = role;
          break;
        case "users":
        case "members":
          //get user param
          let user = params[index];

          //slice param to get id
          if (user.startsWith("<@") && user.endsWith(">"))
            user = user.slice(2, -1);

          if (user.startsWith("!")) {
            user = user.slice(1);
          }

          //if user set mention to user
          if (user) mention = user;
          break;
        default:
          break;
      }
    }

    mention = msg.guild[type].cache.get(mention);
    //Return the mention (can be null)
    return mention || null;
  }
);
