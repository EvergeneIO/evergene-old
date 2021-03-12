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
  path = path.toLowerCase();
  fileName = filename.split(".")[0];
  let fileStart = Date.now();
  if (fileName.toLowerCase() != "index") path += fileName;
  try {
    require(`${filepath}${filename}`)(router, fileName, `${path}`);
  } catch (e) {
    return console.log(`[AUTH] Failed to register "${chalk.yellow(filename)}"! ${e.name}: ${chalk.red(e.message)}`);
  }

  if (process.env.APP_DEBUG == "true") console.log(`[AUTH] Loaded "${chalk.yellow(fileName)}" - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
}

module.exports = router;
