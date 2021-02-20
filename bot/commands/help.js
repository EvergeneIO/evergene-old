const Bot = require("../classes/Bot.js");
const Command = require("../classes/Command.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");
const moment = require("moment");

/**
 * Displays all available commands and their descriptions
 * @author @ACertainCoder @CuzImStantac
 * @param {Discord.Message} msg Command message
 * @param {Array<string>} params Command parameters
 * @returns {Promise<any>} Command return value
 * @async
 */
module.exports = new Command(
  {
    name: "help",
    aliases: ["h"],
    desc: "see all commands or get info to a command",
    usage: "[Command]",
  },
  async function (msg, params) {
    const { client, config, commands } = Bot;

    //Get all commands
    var cmds = Object.values(commands).filter((c) => {
      //Visability
      var visible = !c.hidden;
      //Allowed server
      var server = c.servers ? c.servers.includes(msg.guild.id) : true;
      //allowed role
      var role = c.roles
        ? c.roles.filter((r) => msg.member.roles.cache.has(r)).length > 0
        : true;
      //Allowed user
      var user = c.users ? c.users.includes(msg.author.id) : true;

      return visible == true ? server || role || user : false;
    });

    //Check if the command author hasn't specified something
    if (params.length == 0) {
      //Send the default embed
      var embed = new Embed()
        .addToAuthor(` - ${this.name}`)
        .setDescription(
          `Use \`${config.prefix}${this.name} ${this.usage}\`, to get more info to a command.`
        );

      embed.addField(
        "Command",
        cmds.map((c) => `${config.prefix}${c.name}`).join("\n"),
        true
      );
      embed.addField(
        "Description:",
        cmds.map((c) => `${c.desc}`).join("\n"),
        true
      );

      await msg.channel.send(embed);
      return;
    }

    //Search for suitable commands
    var search = cmds.filter((c) => {
      //Name
      var name = c.name.toLowerCase() == params[0].toLowerCase();
      //Aliases
      var aliases = c.aliases
        ? c.aliases.filter((a) => a.toLowerCase() == params[0].toLowerCase())
        : null;

      return name || (aliases && aliases.length > 0);
    });
    var tests = search.map((c) => c.name.toLowerCase());

    //Declare the embed variable
    var embed = null;

    if (search.length == 0) {
      //No matches
      embed = new Embed()
        .prebuilt("error")
        .setDescription("Couldn't find this command!");
    } else if (tests.includes(params[0].toLowerCase())) {
      var match = search[tests.indexOf(params[0].toLowerCase())];
      //One match
      embed = new Embed()
        .addToAuthor(` - ${this.name} [${match.name}]`)
        .setDescription(match.desc)
        .setFooter("<Necessary> • [Optional]")
        .addField(
          "Usage:",
          `\`${config.prefix}${match.name}${
            match.usage ? " " + match.usage : ""
          }\``,
          true
        )
        .addField(
          "Cooldown:",
          match.cooldown > 0
            ? moment.duration(match.cooldown, "milliseconds").format()
            : "None",
          true
        )
        .addField(
          "Aliases:",
          match.aliases
            ? match.aliases.map((a) => `\`${a}\``).join(", ")
            : "None",
          true
        );

      //Check for a developer
      if (Object.values(config.devs).includes(msg.author.id)) {
        //Convert accesses into strings
        var servers = match.servers
          ? match.servers.map((s) => client.guilds.cache.get(s)).join(", ")
          : "All";
        var roles = match.roles
          ? match.roles.map((r) => msg.guild.roles.cache.get(r)).join(", ")
          : "All";
        var users = match.users
          ? match.users.map((u) => client.users.cache.get(u)).join(", ")
          : "All";
        var perms = match.discord
          ? match.discord.map((p) => `\`${p}\``).join(", ")
          : "None";

        //Add more fields to the embed
        embed.addField(
          "Permissions:",
          `Servers: ${servers}\nRoles: ${roles}\nUser: ${users}\nPermissions: ${perms}`,
          true
        );
        embed.addField("Hidden:", match.hidden ? "Yes" : "No", true);
      }
    } else if (search.length > 0) {
      //Multiple matches
      embed = new Embed()
        .addToAuthor(
          ` - ${this.name} [${
            params.join(" ").length > 30
              ? `${params.join(" ").slice(0, 30)}...`
              : params.join(" ")
          }]`
        )
        .setDescription(
          `**${search.length}** possible command${
            search.length == 1 ? "" : "s"
          }`
        );

      embed.addField(
        "Command:",
        search.map((c) => `${config.prefix}${c.name}`).join("\n"),
        true
      );
      embed.addField(
        "Description:",
        search.map((c) => `${c.desc}`).join("\n"),
        true
      );
    } else {
      //Invalid search results (this should never happen)
      throw new Error("Invalid search results");
    }

    //Send the embed
    await msg.channel.send(embed);
  }
);
