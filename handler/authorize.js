const chalk = require('chalk');
const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs');
const pool = require('../database/connection');

    console.log("\n[AUTH] Loading...");
let startAll = Date.now();
getFiles(`${process.cwd()}/routes/authorize/`, "/");
console.log(`[AUTH] Finished loading - took ${chalk.blue(`${Date.now() - startAll}ms`)}\n`);

function getFiles(filepath, authpath) {
    let allFiles = fs.readdirSync(filepath, { withFileTypes: true });
    let files = allFiles
      .filter((f) => f.name.split(".").pop() == "js")
      .map((f) => f.name);
    files.forEach((file) => {
      addPath(file, filepath, authpath);
    });

    let dirs = allFiles
      .filter((dirent) => !dirent.isFile())
      .map((dirent) => dirent.name);

    dirs.forEach((dir) => {
      getFiles(`${filepath}${dir}/`, `${authpath}${dir}/`);
    });
  }

  async function addPath(filename, filepath, path) {
    let fileStart = Date.now()
    let auth = require(filepath + filename);
    let name = filename.split(".").shift()
    if(name.toLowerCase() != "index") path += name;
    router[auth.type ? auth.type.toLowerCase() : "get"](path, async function (req, res) {
        auth.execute(req, res, pool, fetch);
    });
    if (process.env.APP_DEBUG == "true") console.log(`[AUTH] Loaded "${chalk.yellow(filename)}" as ${chalk.yellow(path)} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
  }

  module.exports = router;
