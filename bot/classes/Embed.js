const Bot = require("./Bot.js");
const Discord = require("discord.js");

/**
 * Embeds are used by our bot all the time. This defines the basic things that will be in them all the time.
 * @author @ACertainCoder
 * @extends {Discord.MessageEmbed}
 */
module.exports = class Embed extends Discord.MessageEmbed {
  /**
   * Create a new MessageEmbed with predefined stuff
   * @param {Object} data Data
   */
  constructor(data = {}) {
    //Calls the MessageEmbed constructor with the predefined data (the data object can overwrite it though)
    super({
      ...{
        author: {
          name: Bot.client.user.username,
          iconURL: Bot.client.user.displayAvatarURL({
            format: "png",
            dynamic: true,
          }),
        },
        color: Discord.Util.resolveColor(Bot.config.color),
      },
      ...data,
    });
  }

  /**
   * Add text to the author name
   * @param {string} text Text
   * @returns {Embed} The embed
   */
  addToAuthor(text) {
    //Check embed state
    if (!this.author || !this.author.name) {
      throw new Error("The author hasn't been set yet");
    }

    //Validate arguments
    if (typeof text != "string") {
      throw new Error(`Expected a string but received "${typeof text}"`);
    }

    //Add the text to the author name
    this.setAuthor(
      this.author.name + text,
      this.author.iconURL,
      this.author.url
    );

    //Return the embed
    return this;
  }

  /**
   * Add text to the description
   * @param {string} text Text
   * @returns {Embed} The embed
   */
  addToDescription(text) {
    //Check embed state
    if (!this.description) {
      throw new Error("The description hasn't been set yet");
    }

    //Validate arguments
    if (typeof text != "string") {
      throw new Error(`Expected a string but received "${typeof text}"`);
    }

    //Add the text to the description
    this.setDescription(this.description + text);

    //Return the embed
    return this;
  }

  /**
   * Add text to the footer content
   * @param {string} text Text
   * @returns {Embed} The embed
   */
  addToFooter(text) {
    //Check embed state
    if (!this.footer || !this.footer.text) {
      throw new Error("The footer hasn't been set yet");
    }

    //Validate arguments
    if (typeof text != "string") {
      throw new Error(`Expected a string but received "${typeof text}"`);
    }

    //Add the text to the footer text
    this.setFooter(this.footer.text + text, this.footer.iconURL);

    //Return the embed
    return this;
  }

  /**
   * Remove the Embed Author
   * @returns {Embed} The embed
   */
  removeAuthor() {
    this.author = null;
    return this;
  }

  /**
   * Remove the Embed Descriptiom
   * @returns {Embed} The embed
   */
  removeDescription() {
    this.description = null;
    return this;
  }

  /**
   * Remove the Embed Footer
   * @returns {Embed} The embed
   */
  removeFooter() {
    this.footer = null;
    return this;
  }

  /**
   * Remove the Embed title
   * @returns {Embed} The embed
   */
  removeTitle() {
    this.title = null;
    return this;
  }

  /**
   * Choose a prebuilt embed type
   * @param {string} type Embed Type
   * @param {Object} remove remove author/desc/title/footer
   * @returns {Embed} The embed
   */
  prebuilt(type, remove = {}) {
    //Check if type exists
    if (!type) throw new Error(`There was no type provided`);

    //Validate arguments
    if (typeof type != "string") {
      throw new Error(`Expected a string but received "${typeof type}"`);
    }

    type = type.toLowerCase();

    if (typeof remove != "object") {
      throw new Error(`Expected a object but received "${typeof remove}"`);
    }

    //fill in missing params
    if (remove.author == undefined) remove.author = true;
    if (remove.desc == undefined) remove.desc = true;
    if (remove.footer == undefined) remove.desc = true;
    if (remove.title == undefined) remove.desc = true;

    //remove Author and Description
    if (remove.author == true) this.removeAuthor();
    if (remove.desc == true) this.removeDescription();
    if (remove.footer == true) this.removeFooter();
    if (remove.title == true) this.removeTitle();

    //find type
    switch (type) {
      default:
        throw new Error(`Couldn't find the embed type "${type}"`);

      case "success":
        this.setColor(Bot.config.colors.green).setDescription("✅ | ");
        break;

      case "load":
        this.setColor(Bot.config.colors.yellow).setDescription("⏳ | ");
        break;

      case "error":
        this.setColor(Bot.config.colors.red).setDescription("❌ | ");
        break;
    }
    return this;
  }
};
