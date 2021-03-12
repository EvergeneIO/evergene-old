const chalk = require('chalk');
const router = require('express').Router();
const { version } = require("../package.json");
const fetch = require('node-fetch');
const pool = require('../database/connection');
const cookie = require('cookie');
const tools = require('../functions');
const fs = require('fs');

console.log("\n[MAIN] Loading...");
let startAll = Date.now();
getFiles(`${process.cwd()}/routes/web/`, "/", true);
console.log(`[MAIN] Finished loading - took ${chalk.blue(`${Date.now() - startAll}ms`)}\n`);

function getFiles(filepath, mainpath, first = false) {
    let allFiles = fs.readdirSync(filepath, { withFileTypes: true });
    let files = allFiles
        .filter((f) => f.name.split(".").pop() == "js")
        .map((f) => f.name);
    files.forEach((file) => {
        addPath(file, filepath, mainpath);
    });

    let dirs = allFiles
        .filter((dirent) => !dirent.isFile())
        .map((dirent) => dirent.name);

    dirs.forEach((dir) => {
        getFiles(`${filepath}${dir}/`, `${mainpath}${dir}/`);
    });
}

async function addPath(filename, filepath, path) {
    path = path.toLowerCase();
    filename = filename.split(".")[0];
    let fileStart = Date.now();

    if (filename.toLowerCase() != "home") path += filename;
    try {
        require(`${filepath}${filename}`)(router, filename, `${path}`);
    } catch (e) {
        return console.log(`[MAIN] Failed to register "${chalk.yellow(filename)}"! ${e.name}: ${chalk.red(e.message)}`);
    }

    if (process.env.APP_DEBUG == "true") console.log(`[MAIN] Loaded "${chalk.yellow(filename)}" - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
}

module.exports = router;
