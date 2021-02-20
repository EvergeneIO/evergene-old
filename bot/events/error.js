const Event = require("../classes/Event.js");

/**
 * Emitted when the client becomes ready to start working
 * @author @ACertainCoder
 * @param {Error} error Error
 */
module.exports = new Event(
  {
    name: "Error",
    desc: "An error has been attempted in the Discord Client",
    type: Event.DISCORD,
  },
  async function (error) {
    //Filter errors
    switch (error.message) {
      //Unexpected server response: 520
      case "Unexpected server response: 520":
        console.error("Cannot connect to the Discord API. Retrying...");
        break;
      //read ECONNRESET
      case "read ECONNRESET":
        console.error("Connection reset! Reconnecting...");
        break;
      //Others
      default:
        console.error(error);
        break;
    }
  }
);
