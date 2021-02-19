const Bot = require("../classes/Bot.js");
const Command = require("../classes/Command.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");

/**
 * See all custom roles or edit them
 * @author @CuzImStantac
 * @param {Discord.Message} msg Command message
 * @param {Array<string>} params Command parameters
 * @returns {Promise<any>} Command return value
 * @async
 */
module.exports = new Command(
  {
    name: "roles",
    aliases: ["role"],
    desc: "See all custom roles or edit them (MANAGE_GUILD)",
  },
  async function (msg, params) {
    const { tools, config, roles } = Bot;
    let key;

    var embed = new Embed().addToAuthor(` - ${this.name}`);

    if (params.length < 1) {
      //map all roles and set the description
      embed.setDescription([
        `Use \`${config.prefix}<Role Name>\` to add/remove yourself a role.`,
        "",
        "[Role Name • Role]",
        Object.entries(roles)
          .map((r) => `${r[0]} • <@&${r[1]}>`)
          .join("\n"),
      ]);

      //if member has permissions add configuration information
      if (msg.member.hasPermission("MANAGE_GUILD"))
        embed.addToDescription(
          `\n\nConfiguration: \`${config.prefix}${this.name} <add/edit/remove> <Role Name> <Role>\``
        );
    } else {
      //check if memeber has perms to edit the roles
      if (!msg.member.hasPermission("MANAGE_GUILD"))
        return msg.channel.send(
          new Embed().prebuilt("error").addToDescription("Missing permissions!")
        );

      //get params
      let command = params[0];
      let name = params[1];
      let role = await tools.getMention.call("roles", 2, msg, params);

      //find command to execute
      if (name) {
        switch (command.toLowerCase()) {
          default:
            //triggers if parameter is unknown
            embed.prebuilt("error").addToDescription(`Unknown parameter!`);
            break;
          case "add": //add a role to the custom roles
            //check if role exists
            if (
              Object.keys(roles).some(
                (r) => r.toLowerCase() == name.toLowerCase()
              )
            ) {
              embed = new Embed()
                .prebuilt("error")
                .addToDescription(
                  `Name already taken! Use \`${config.prefix}${this.name} edit <Name> <Role>\` to change the role.`
                );
              break;
            }

            //check if role exists
            if (!role) {
              embed = new Embed()
                .prebuilt("error")
                .addToDescription(`There was no role provided.`);
              break;
            }

            //add role
            roles[name] = role.id;

            //create success embed
            embed
              .prebuilt("success", { author: false })
              .addToDescription(`Role [\`${name}\`] was added!`);
            break;

          case "edit": //edit a role from the custom roles
            //check if role exists
            if (
              !Object.keys(roles).some(
                (r) => r.toLowerCase() == name.toLowerCase()
              )
            ) {
              embed = new Embed()
                .prebuilt("error")
                .addToDescription(
                  `Couldn't find this role! Use add to add the role.`
                );
              break;
            }

            //check if role exists
            if (!role) {
              embed = new Embed()
                .prebuilt("error")
                .addToDescription(`There was no role provided.`);
              break;
            }
            //find key with right case
            key = Object.keys(roles).find(
              (r) => r.toLowerCase() == name.toLowerCase()
            );

            //edit role
            roles[key] = role.id;

            //create success embed
            embed
              .prebuilt("success", { author: false })
              .addToDescription(`Role [\`${key}\`] was edited!`);
            break;

          case "remove": //remove a role to the custom roles
            //check if role exists
            if (
              !Object.keys(roles).some(
                (r) => r.toLowerCase() == name.toLowerCase()
              )
            ) {
              embed = new Embed()
                .prebuilt("error")
                .addToDescription(
                  `Couldn't find this role! Use add to add the role.`
                );
              break;
            }

            //find key with right case
            key = Object.keys(roles).find(
              (r) => r.toLowerCase() == name.toLowerCase()
            );

            //delete role
            delete roles[key];

            //create success embed
            embed
              .prebuilt("success", { author: false })
              .addToDescription(`Role [\`${key}\`] was removed!`);
            break;
        }

        //save the data
        tools.saveData.call();
      } //returns error if no name was provided
      else
        embed = new Embed()
          .prebuilt("error")
          .addToDescription(`Please provide a role name to ${command}!`);
    }
    await msg.channel.send(embed);
  }
);
