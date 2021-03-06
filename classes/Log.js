const chalk = require("chalk");
const fs = require("fs");
/**
 * create console logs and save them in a logfile
 * @author @CuzImStantac
 */
module.exports = class Log {
  _type = 0; // Log type
  _message = "Logged!"; // Log Message
  _logFile = true; // Log in file?
  _logPath = "./logs/.log"; // Log path

  //Types
  static LOG = 0;
  static SUCCESS = 1;
  static WARN = 2;
  static ERROR = 3;
  static DEBUG = 4;

  /**
   * Log Type
   * @type {Number}
   */
  get type() {
    return this._type;
  }
  set type(type) {
    this._type = type;
  }

  /**
   * Log Message
   * @type {String}
   */
  get message() {
    return this._messae;
  }
  set message(message) {
    this._message = message;
  }

  /**
   * Write Log in file?
   * @type {Boolean}
   */
  get logFile() {
    return this._logFile;
  }
  set logFile(type) {
    this._logFile = type;
  }

  /**
   * Log path
   * @type {String}
   */
  get logPath() {
    return this._logPath;
  }
  set logPath(logPath) {
    this._logPath = logPath;
  }

  /**
   * @param {Object} config The log config
   * @param {Number} config.type 0 = Log, 1 = Success, 2 = Warn, 3 = Error
   * @param {String} config.message Log message
   * @param {Boolean} config.logFile Add log to logfile?
   * @param {String} config.logPath Path to the logfile
   */
  constructor({ type, message, logFile, logPath } = {}) {
    if (type && typeof type != "number") {
      throw new Error(`Expected a number but received "${typeof type}"`);
    }
    if (message && typeof message != "string") {
      throw new Error(`Expected a string but received "${typeof message}"`);
    }
    if (logFile && typeof logFile != "boolean") {
      throw new Error(`Expected a boolean but received "${typeof logFile}"`);
    }
    if (logPath && typeof logPath != "string") {
      throw new Error(`Expected a string but received "${typeof logPath}"`);
    }

    this._type = type || this.type;
    this._message = message || this.message;
    this._logFile = logFile || this.logFile;
    this._logPath = logPath || this.logPath;

    let typeString = "LOG";
    switch (this._type) {
      default:
        throw TypeError(`Invalid Log type "${this._type}"!`);
      case 0:
        console.log(
          `[${chalk.blue(Log.formatDate())}] ${chalk.greenBright(
            `LOG`
          )} > ${chalk.white(this._message)}`
        );
        break;
      case 1:
        typeString = "SUCCESS";
        console.log(
          `[${chalk.blue(Log.formatDate())}] ${chalk.greenBright(
            `SUCCESS`
          )} > ${chalk.white(this._message)}`
        );
        break;
      case 2:
        typeString = "WARN";
        console.warn(
          `[${chalk.blue(Log.formatDate())}] ${chalk.yellowBright(
            `WARN`
          )} > ${chalk.white(this._message)}`
        );
        break;
      case 3:
        typeString = "ERROR";
        console.error(
          `[${chalk.blue(Log.formatDate())}] ${chalk.redBright(
            `ERROR`
          )} > ${chalk.white(this._message)}`
        );
        break;
      case 4:
        console.debug(
          `[${chalk.blue(Log.formatDate())}] ${chalk.blueBright(
            `DEBUG`
          )} > ${chalk.white(this._message)}`
        );
        this.logFile = false;
        break;
    }
    if (this._logFile) {
      if (!fs.existsSync(this._logPath)) {
        fs.writeFileSync(this._logPath, "");
      }
      fs.appendFileSync(
        this._logPath,
        `[${Log.formatDate()}] ${typeString} > ${this._message}\n`.replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          ""
        )
      );
    }
  }

  /**
   * format a certain Date
   * @param {Date} date the date to format
   * @returns {String}
   */
  static formatDate(date) {
    if (date && date instanceof Date) {
      throw TypeError(`Expected a Date but recived "${typeof date}"!`);
    }

    let formatDate = date || new Date();

    return `${formatDate.getDate() < 10 ? "0" : ""}${formatDate.getDate()}.${
      formatDate.getMonth() + 1 < 10 ? "0" : ""
    }${formatDate.getMonth() + 1}.${formatDate.getFullYear()} um ${
      formatDate.getHours() < 10 ? "0" : ""
    }${formatDate.getHours()}:${
      formatDate.getMinutes() < 10 ? "0" : ""
    }${formatDate.getMinutes()}`;
  }
};
