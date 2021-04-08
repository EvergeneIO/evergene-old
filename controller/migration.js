const chalk = require("chalk");
const fs = require("fs");
const con = require("../database/connection");

module.exports = () => {
  return new Promise(async (resolve) => {
    let files = fs.readdirSync("../migration/");
    try {
      con.query("SELECT timestamp FROM migrations", async (err, res) => {
        try {
          if (err) {
            // ! Create Table Migration (User etc) + Timestamp Entry in 'migrations' (Use the Newest "create" migration)
            await new Promise((resolve1, reject1) => {
              con.query(
                "CREATE TABLE migrations (timestamp VARCHAR(255))",
                (err1, res1) => {
                  if (!err) reject1(err);
                  resolve1();
                }
              );
            });
          } else {
            files = files.filter((f) => f.split(" ")[0] > res[0]);
          }
          files.forEach(async (f) => await require(f)(con));
          con.query("UPDATE migrations SET timestamp = 123 WHERE id = 1"); //! QUERY TO INSERT TIMESTAMP (HELP)
          resolve();
        } catch (e) {
          throw e;
        }
      });
    } catch (e) {
      console.log(
        chalk.redBright(
          "[MIGRATION] There was an error during the migraton! Please contact the Evergene support."
        )
      );
      console.error(e);
    }
  });
};

// 1
// 2
// 3
// 4
//? 2 = 3 + 4
//CREATE TABLE migrations (timestamp VARCHAR(255))

/**
 * on start: check if migration table Exist?
 * yes = check latest Migration
 * no = create Table
 */
