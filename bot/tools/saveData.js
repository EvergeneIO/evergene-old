const Bot = require("../classes/Bot.js");
const Tool = require("../classes/Tool.js");

const fs = require("fs");

/**
 * Saves all data inside the corresponding folder
 * @author @ACertainCoder
 * @param {Object} object Data object
 * @param {Array<string>} folders Data folders (sub directories)
 * @async
 */
module.exports = new Tool(
  {
    name: "Save Data",
    desc: "Saves all data inside the corresponding folder",
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
      console.log(`Saving ${dir}`);

      //Loop through the directory
      fs.readdirSync(`${cwd}/${dir}`).forEach(async (entry) => {
        //Check if the entry is a folder
        if (fs.statSync(`${cwd}/${dir}/${entry}`).isDirectory()) {
          //Check if data exists
          if (object[entry]) {
            //Call the tool again
            await Bot.tools.saveData.call(object[entry], [...folders, entry]);
          } else {
            //Otherwise log an error
            console.error(`No existing data for "${dir}/${entry}"`);
          }

          //Continue with the next entry
          return;
        }

        //Filename and extension
        var [name, ext] = entry.split(/.([^.]*)$/);

        //Save data
        try {
          if (args.debug) console.log(`Saving "${dir}/${entry}"...`);
          switch (ext) {
            //JavaScript
            case "js":
              //Nothing will be saved
              break;
            //JavaScript Object Notation
            case "json":
              //Check if no data exists
              if (!object[name]) {
                console.error(`No existing data for "${dir}/${entry}"`);
                return;
              }

              //Convert it to a JSON string and store that
              if (typeof object[name].toJSON == "function") {
                fs.writeFileSync(
                  `${cwd}/${dir}/${entry}`,
                  JSON.stringify(object[name].toJSON(), null, 4)
                );
              } else {
                fs.writeFileSync(
                  `${cwd}/${dir}/${entry}`,
                  JSON.stringify(object[name], null, 4)
                );
              }
              break;
            //Text File
            case "txt":
              //Check if no data exists
              if (!object[name]) {
                console.error(`No existing data for "${dir}/${entry}"`);
                return;
              }

              //Store the plain content
              fs.writeFileSync(`${cwd}/${dir}/${entry}`, object[name]);
              break;
            //Unknown
            default:
              //Nothing will be saved
              if (args.debug) console.log(`Skipping "${dir}/${entry}"...`);
          }
        } catch (e) {
          if (args.debug) console.log(`Failed to save "${dir}/${entry}"!`);
          console.error(e);
        }
      });
    } else {
      throw new Error("Data folder missing");
    }
  }
);
