const Tool = require("./Tool.js");

/**
 * Events will be executed by the bot or process.
 * @author @ACertainCoder
 */
module.exports = class Event extends Tool {
  _type = null; //Event type
  _timeout = 0; //Timeout
  _interval = 0; //Interval
  _hidden = false; //Hidden event

  static PROCESS = 0;
  static INTERVAL = 1;
  static TIMEOUT = 2;
  static DISCORD = 3;

  /**
   * Event type (PROCESS, DISCORD)
   * @type {Number}
   * @readonly
   */
  get type() {
    return this._type;
  }

  /**
   * Timeout (milliseconds, used by setTimeout)
   * @type {Number}
   * @readonly
   */
  get timeout() {
    return this._timeout;
  }

  /**
   * Interval (milliseconds, used by setInterval)
   * @type {Number}
   * @readonly
   */
  get interval() {
    return this._interval;
  }

  /**
   * Hidden event (will not be displayed on lists)
   * @type {Boolean}
   * @readonly
   */
  get hidden() {
    return this._hidden;
  }

  /**
   * New Event
   * @param {Object<string, any>} data Information about the event
   * @param {Function} code Code which will be executed
   */
  constructor({ name, desc, type, timeout, interval, hidden } = {}, code) {
    super({ name, desc }, code);

    //Validate arguments
    if (type && typeof type != "number") {
      throw new Error(`Expected a number but received "${typeof type}"`);
    }
    if (timeout && typeof timeout != "number") {
      throw new Error(`Expected a number but received "${typeof timeout}"`);
    }
    if (interval && typeof interval != "number") {
      throw new Error(`Expected a number but received "${typeof interval}"`);
    }
    if (hidden && typeof hidden != "boolean") {
      throw new Error(`Expected a boolean but received "${typeof hidden}"`);
    }

    //Set data
    this._type = type || this.type;
    this._timeout = timeout || this.timeout;
    this._interval = interval || this.interval;
    this._hidden = hidden || this.hidden;
  }

  /**
   * Run the event
   * @returns {Promise<any>} Event return value
   * @async
   */
  async call() {
    try {
      //Execute event
      return await super._exec.apply(this, arguments);
    } catch (e) {
      //Log errors
      console.log(`Failed to execute event "${this.name}"`);
      console.error(e);
    }
  }

  /**
   * Run the event
   * @param {Array | IArguments} params Event parameters
   * @returns {Promise<any>} Event return value
   * @async
   */
  async apply(params = []) {
    return await this.call.apply(this, params);
  }
};
