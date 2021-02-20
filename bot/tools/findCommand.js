const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");

/**
 * This will check if the provided text starts with the prefix or mentioned the bot and search for an available command
 * @author @ACertainCoder
 * @param {string} content Text content
 * @param {number} type Command type
 * @returns {Object{command: string, params: string[], mention: boolean}} Command & parameters
 * @async
 */
module.exports = new Tool(
  {
    name: "Find Command",
    desc:
      "This will check if the provided text starts with the prefix or mentioned the bot and search for an available command",
  },
  async function (content) {
    const { client, config } = Bot;

    //Validate arguments
    if (typeof content != "string") {
      throw new Error(`Expected a string but received "${typeof content}"`);
    }

    //Get the bot mention as regex
    const mention = new RegExp(`^(<@!?${client.user.id}>)`);
    //Get the bot prefix as regex
    const prefix = new RegExp(`^(\\${config.prefix.split("").join("\\")})`);
    //Replaces spaces at the beginning of the message and splits the actual text at each space
    var params = content.replace(/^\s+/, "").split(/\s+/g);
    //Search for prefix and mention in the text
    var matches = {
      prefix: params[0].match(prefix),
      mention: params[0].match(mention),
    };

    if (matches.prefix || matches.mention) {
      //Get amount of characters in the matched item
      const ignore = matches.prefix
        ? matches.prefix[0].length
        : matches.mention[0].length;
      //Push all params one to the left and use the original first param as command but without the characters of the matched item (prefix / mention)
      var command = params.splice(0, 1)[0].substring(ignore);

      //If the prefix and command are separated, push all params one to the left and use the original first param as command
      if (command.length == 0 && params.length > 0) {
        command = params.splice(0, 1)[0];
      }

      return { command: command, params: params, mention: !!matches.mention };
    } else {
      return { command: null, params: null, mention: null };
    }
  }
);
