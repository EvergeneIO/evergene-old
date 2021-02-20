const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");

const util = require("util");

/**
 * Returns a promise which will resolve after the specified time
 * @author @ACertainCoder
 * @param {number} time Time to sleep
 * @async
 */
module.exports = new Tool(
  {
    name: "Sleep",
    desc:
      "Gibt einen Promise zurück, welcher nach der angegebenen Zeit resolved wird",
  },
  async function (time, ...params) {
    const { client } = Bot;

    //Return a new promise
    return new Promise((resolve, reject) => {
      //Pass the resolve function, time to sleep and other params to the setTimeout method of the client
      client.setTimeout(resolve, time, ...params);
    });
  }
);
