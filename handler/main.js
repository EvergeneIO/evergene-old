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
    let fileStart = Date.now()
    let api = require(filepath + filename);
    let name = filename.split(".").shift()
    let endPath = `${path}`
    if (name.toLowerCase() != "home") endPath += name.toLowerCase();
    if (api.dynamic) {
        if (typeof api.dynamic == "string") {
            if (!api.dynamic.startsWith("/")) api.dynamic = "/" + api.dynamic
            endPath += api.dynamic
        }
    }

let authFunction = async (req, res, next) => {
    return next()
}

if(api.auth) authFunction = tools.forceAuth;

    router[api.type ? api.type.toLowerCase() : "get"](endPath, authFunction, async (req, res) => {

        let lang = tools.checkCookie(req, res)


        filename = filename.split(".").shift().toLowerCase()
        let title = filename.slice(0, 1).toUpperCase() + filename.slice(1).toLowerCase()
        api.execute(req, res, name, lang, version, title, req.session.user || null);
    });
    if (process.env.APP_DEBUG == "true") console.log(`[MAIN] Loaded "${chalk.yellow(name)}" as ${chalk.yellow(endPath)} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
}

module.exports = router;
