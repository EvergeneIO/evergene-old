const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");

const fs = require("fs");

/**
 * Loads all data inside the corresponding folder
 * @author @ACertainCoder
 * @param {Object} object Data object
 * @param {Array<string>} folders Data folders (sub directories)
 * @async
 */
module.exports = new Tool(
  {
    name: "Load Data",
    desc: "Loads all data inside the corresponding folder",
  },
  async function (object = Bot, folders = []) {
    const { cwd, args } = Bot;

    //Validate arguments
    if (typeof object != "object" && object != Bot) {
      throw new Error(`Expected an object but received "${typeof object}"`);
    }
    if (!(folders instanceof Array)) {
      throw new Error(`Expected an array but received "${typeof folders}"`);
    }

    //Get the current directory path
    const dir = `data${folders.length > 0 ? "/" + folders.join("/") : ""}`;

    //Check if the directory exists
    if (fs.existsSync(`${cwd}/${dir}`)) {
      console.log(`Loading ${dir}`);

      //Loop through the directory
      fs.readdirSync(`${cwd}/${dir}`).forEach(async (entry) => {
        //Check if the entry is a folder
        if (fs.statSync(`${cwd}/${dir}/${entry}`).isDirectory()) {
          //Check if no data exists
          if (!object[entry]) {
            //Create another data object inside the current data object
            object[entry] = {};
          }

          //Call the tool again
          await Bot.tools.loadData.call(object[entry], [...folders, entry]);

          //Continue with the next entry
          return;
        }

        //Filename and extension
        var [name, ext] = entry.split(/.([^.]*)$/);

        //Load data
        try {
          if (args.debug) console.log(`Loading "${dir}/${entry}"...`);
          switch (ext) {
            //JavaScript
            case "js":
              //Delete require cache (if existent)
              try {
                delete require.cache[require.resolve(`${cwd}/${dir}/${entry}`)];
              } catch (e) {}

              //Load file
              object[name] = require(`${cwd}/${dir}/${entry}`);
              break;
            //JavaScript Object Notation
            case "json":
              object[name] = JSON.parse(
                fs.readFileSync(`${cwd}/${dir}/${entry}`, "utf8")
              );
              break;
            //Text File
            case "txt":
              object[name] = fs.readFileSync(`${cwd}/${dir}/${entry}`, "utf8");
              break;
            //Unknown
            default:
              //Nothing will be loaded
              if (args.debug) console.log(`Skipping "${dir}/${entry}"...`);
              //Store the only the path to this file
              object[name] = `${cwd}/${dir}/${entry}`;
          }
        } catch (e) {
          if (args.debug) console.log(`Failed to load "${dir}/${entry}"!`);
          console.error(e);
        }
      });
    } else {
      throw new Error("Data folder missing");
    }
  }
);
