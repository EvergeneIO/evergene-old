const fs = require("fs");
const router = require('express').Router();
const tools = require('../functions');
const bodyParser = require('body-parser');
const { json
} = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
const chalk = require('chalk');
const fetch = require('node-fetch');


console.log("\n[USER-API] Loading...");
let startAll = Date.now();
getFiles(`${process.cwd()}/routes/api/u/`, "/");
console.log(`[USER-API] Finished loading - took ${chalk.blue(`${Date.now() - startAll}ms`)}\n`);

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
    let fileStart = Date.now();
    const fileName = filename.split(".").shift().toLowerCase();
    const api = require(`${filepath}/${filename}`);
    let endPath = `${path}${fileName}`
        if (api.dynamic) {
        if (typeof api.dynamic == "string") {
            if(!api.dynamic.startsWith("/")) api.dynamic = "/" + api.dynamic
            endPath += api.dynamic
        }
    }
    router["get"](endPath, jsonParser, urlencodedParser, async (req, res) => {


        if (!api.status) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }

        try {
            await api.execute(req, res, fileName, tools)
        } catch (err) {
            //Log error if debug mode is enabled
            if (process.env.APP_DEBUG == "true") console.error(err);

            //return error on error
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    });
    if (process.env.APP_DEBUG == "true") console.log(`[USER-API] Loaded "${chalk.yellow(filename)}" as ${chalk.yellow(`/api/u${endPath}`)} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
}


module.exports = router;