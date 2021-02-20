/**
 * Tools are used by our bot all the time. They can do lots of useful stuff.
 * @author @ACertainCoder
 */
module.exports = class Tool {
  _name = null; //Name
  _desc = null; //Description
  _code = null; //Code to execute

  /**
   * Name
   * @type {string}
   * @readonly
   */
  get name() {
    return this._name;
  }

  /**
   * Description
   * @type {string}
   * @readonly
   */
  get desc() {
    return this._desc;
  }

  /**
   * Code to execute
   * @type {Function}
   * @readonly
   */
  get code() {
    return this._code;
  }

  /**
   * New Tool
   * @param {Object<string, any>} data Information about the tool
   * @param {Function} code Code which will be executed
   */
  constructor({ name, desc } = {}, code) {
    //Validate arguments
    if (typeof name != "string") {
      throw new Error(`Expected a string but received "${typeof name}"`);
    }
    if (typeof desc != "string") {
      throw new Error(`Expected a string but received "${typeof desc}"`);
    }
    if (typeof code != "function") {
      throw new Error(`Expected a function but received "${typeof code}"`);
    }

    //Set data
    this._name = name || this.name;
    this._desc = desc || this.desc;
    this._code = code || this.code;
  }

  /**
   * Run the tool
   * @returns {Promise<any>} Tool return value
   * @async
   */
  async call() {
    try {
      //Execute tool
      return await this._exec.apply(this, arguments);
    } catch (e) {
      //Log errors
      console.log(`Failed to execute tool "${this.name}"`);
      console.error(e);
    }
  }

  /**
   * Run the tool
   * @param {Array | IArguments} params Tool parameters
   * @returns {Promise<any>} Tool return value
   * @async
   */
  async apply(params = []) {
    //Redirect
    return await this.call.apply(this, params);
  }

  /**
   * Execute the tool
   * @returns {Promise<any>} Code return value
   * @throws Code error
   * @async
   * @private
   */
  async _exec() {
    //Execute code
    return await this.code.apply(this, arguments);
  }
};
