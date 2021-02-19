const Bot = require("./Bot.js");
const Tool = require("../classes/Tool.js");
const Embed = require("../classes/Embed.js");

const Discord = require("discord.js");
const moment = require("moment");
const util = require("util");

/**
 * Commands can be used in Discord or the console.
 * @author @ACertainCoder
 */
module.exports = class Command extends Tool {
  _usage = null; //Usage
  _cooldown = 0; //Cooldown
  _aliases = null; //Aliases
  _hidden = false; //Hidden command
  _perms = null; //Permissions

  _executions = {}; //Executions

  /**
   * Usage (additional parameters)
   * @type {string}
   * @readonly
   */
  get usage() {
    return this._usage;
  }

  /**
   * Cooldown (milliseconds, userspecific)
   * @type {Number}
   * @readonly
   */
  get cooldown() {
    return this._cooldown;
  }

  /**
   * Aliases
   * @type {Array<string>}
   * @readonly
   */
  get aliases() {
    return this._aliases;
  }

  /**
   * Hidden command (will not be displayed on lists)
   * @type {Boolean}
   * @readonly
   */
  get hidden() {
    return this._hidden;
  }

  /**
   * Permissions (required to execute this command)
   * @type {Discord.Collection<string, (Array<string> | Discord.Collection<string, Array<string>)>}
   * @readonly
   */
  get perms() {
    return this._perms;
  }

  /**
   * Executions (users, last time)
   * @type {Object<string, string>}
   * @readonly
   */
  get executions() {
    return this._executions;
  }

  /**
   * New Command
   * @param {Object<string, any>} data Information about the command
   * @param {Function} code Code which will be executed
   */
  constructor(
    { name, desc, usage, cooldown, aliases, hidden, perms } = {},
    code
  ) {
    super({ name, desc }, code);

    //Validate arguments
    if (usage && typeof usage != "string") {
      throw new Error(`Expected a string but received "${typeof usage}"`);
    }
    if (cooldown && typeof cooldown != "number") {
      throw new Error(`Expected a number but received "${typeof cooldown}"`);
    }
    if (aliases && !(aliases instanceof Array)) {
      throw new Error(`Expected an array but received "${typeof aliases}"`);
    }
    if (hidden && typeof hidden != "boolean") {
      throw new Error(`Expected a boolean but received "${typeof hidden}"`);
    }
    if (perms && !(perms instanceof Discord.Collection)) {
      throw new Error(
        `Expected a Discord Collection but received "${typeof perms}"`
      );
    }

    //Set data
    this._usage = usage || this.usage;
    this._cooldown = cooldown || this.cooldown;
    this._aliases = aliases || this.aliases;
    this._hidden = hidden || this.hidden;
    this._perms = perms || this.perms;
  }

  /**
   * Check if the user has permissions to execute this command
   * @param {string} server Server ID
   * @param {Array<string>} roles Role IDs
   * @param {string} user User ID
   * @returns {boolean} Permissions
   */
  hasPermissions(server, roles, user, member) {
    //Check if there are any permissions set
    if (this.perms) {
      //Get all permissions
      const SERVERS = this.perms.get("servers");
      const ROLES = this.perms.get("roles");
      const USERS = this.perms.get("users");
      const DISCORD = this.perms.get("discord");

      //Check server
      if (SERVERS instanceof Array) {
        if (!SERVERS.includes(server)) return false;
      }
      //Check roles
      if (
        ROLES instanceof Discord.Collection &&
        ROLES.get(server) instanceof Array
      ) {
        if (!ROLES.get(server).find((r) => roles.includes(r))) return false;
      }
      //Check user
      if (USERS instanceof Array) {
        if (!USERS.includes(user)) return false;
      }

      if (DISCORD instanceof Array || DISCORD instanceof String) {
        if (!member.hasPermission(DISCORD)) return false;
      }
    }

    //If no permission was missing, continue
    return true;
  }

  /**
   * Check if the message author has permissions to execute this command
   * @param {Discord.Message} msg Command message
   * @returns {boolean} Permissions
   */
  hasPerms(msg) {
    const { config } = Bot;
    //Validate arguments
    if (!(msg instanceof Discord.Message)) {
      throw new Error(
        `Expected a Discord message but received "${typeof msg}"`
      );
    }

    if (msg.channel.type != "dm") {
      if (Object.values(config.devs).includes(msg.author.id)) return true;
      return this.hasPermissions(
        msg.guild.id,
        msg.member.roles.cache.array().map((r) => r.id),
        msg.author.id,
        msg.member
      );
    } else {
      throw new Error("Direct messages aren't allowed");
    }
  }

  /**
   * Check if the user has cooldown at this command
   * @param {string} user User ID
   * @returns {boolean}
   */
  hasCooldown(user) {
    //Check if this command has cooldown enabled and if the user has executed this command before
    if (this.cooldown > 0 && this.executions[user]) {
      //If so, check if the current date is before the ending date of the cooldown
      return moment().isBefore(
        moment(this.executions[user]).add(this.cooldown, "milliseconds")
      );
    } else {
      //Otherwise, this user cannot have any cooldown at this command
      return false;
    }
  }

  /**
   * Run the command
   * @param {Discord.Message} msg Command message
   * @param {Array<string>} params parameters
   * @returns {Promise<any>} Command return value
   * @async
   */
  async call(msg, params) {
    //Validate arguments
    if (!(msg instanceof Discord.Message)) {
      throw new Error(
        `Expected a Discord message but received "${typeof msg}"`
      );
    }
    if (!(params instanceof Array)) {
      throw new Error(`Expected an array but received "${typeof params}"`);
    }

    //Store the execution ISO date
    this._executions[msg.author.id] = moment().toISOString();

    try {
      //Execute command
      return await super._exec.apply(this, arguments);
    } catch (e) {
      //Log errors
      console.log(`Failed to execute command "${this.name}"`);
      console.error(e);

      //Send error message
      var embed = new Embed()
        .addToAuthor(` - ${e.name} [${e.message}]`)
        .setColor(Bot.config.colors.red);

      //Inspect the error if the bot owner executed the command
      if (msg.author.id == Bot.config.devs["CuzImStantac#6239"]) {
        embed.setDescription(
          "```js\n" + util.inspect(e, { depth: null }) + "\n```"
        );
      } else {
        embed.setDescription(
          "If this problem persists, please contact a team member."
        );
      }

      await msg.channel.send(embed);
    }
  }

  /**
   * Run the command
   * @param {Array | IArguments} params Command parameters
   * @returns {Promise<any>} Command return value
   * @async
   */
  async apply(params = []) {
    return await this.call.apply(this, params);
  }
};
