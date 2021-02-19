const Discord = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
require("moment-duration-format");
const util = require("util");
const path = require("path");
const fs = require("fs");

/**
 * @typedef Data
 * @type {Object<string, any>}
 */

/**
 * The bot container
 * @author @ACertainCoder
 * @abstract
 * @hideconstructor
 */
module.exports = class Bot {
  static _client = null;
  static _config = null;
  static _commands = null;
  static _events = null;
  static _tools = null;

  static _args = { debug: false };
  static _cwd = path.resolve(process.cwd() + '/bot/');
  static _env = process.env;

  /**
   * Client
   * @type {Discord.Client}
   */
  static get client() {
    return this._client;
  }
  static set client(client) {
    this._client = client;
  }

  /**
   * Configuration
   * @type {Data}
   */
  static get config() {
    return this._config;
  }
  static set config(config) {
    this._config = config;
  }

  /**
   * Commands
   * @type {Data}
   */
  static get commands() {
    return this._commands;
  }
  static set commands(commands) {
    this._commands = commands;
  }

  /**
   * Events
   * @type {Data}
   */
  static get events() {
    return this._events;
  }
  static set events(events) {
    this._events = events;
  }

  /**
   * Tools
   * @type {Data}
   */
  static get tools() {
    return this._tools;
  }
  static set tools(tools) {
    this._tools = tools;
  }

  /**
   * Process arguments
   * @type {Object<string, boolean>}
   */
  static get args() {
    return this._args;
  }
  static set args(args) {
    this._args = args;
  }

  /**
   * Current working directory
   * @type {string}
   */
  static get cwd() {
    return this._cwd;
  }
  static set cwd(cwd) {
    this._cwd = cwd;
  }

  /**
   * Process .env
   * @type {Object}
   */
  static get env() {
    return this._env;
  }
  static set env(env) {
    this._env = env;
  }

  /**
   * This class is abstract and therefore cannot be instantiated.
   * @hideconstructor
   */
  constructor() {
    throw Error("The bot cannot be instantiated.");
  }

  static boot() {
    require("../tools/boot.js").call(true);
  }
};
