const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");

/**
 * Extends libraries (other node modules)
 * @author @ACertainCoder
 * @async
 */
module.exports = new Tool(
  {
    name: "Extend Libraries",
    desc: "Extends libraries (other node modules)",
  },
  async function () {
    const { tools } = Bot;

    //Moment.js
    await tools.extendMoment.call();
  }
);
