const fs = require("fs");
const fetch = require("node-fetch");
const router = require('express').Router();
let filename = "test.sql"

 let stream = fs.createWriteStream(`./migration/${filename}`);

fetch(`http://localhost:3001/${filename}`).then((binary) => {
    binary.body.pipe(stream);
});
stream.on("finish", () => console.log("Finish!"))
module.exports = router;


//AUFBAU
// TABLES.json > all file names etc.
