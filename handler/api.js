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
const pool = require(`${process.cwd()}/database/connection`);
const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID || '813143436621643806', process.env.WEBHOOK_TOKEN || 'CZBAIJBwv2AiKAl7NfGTLmHigLhjS9P_X_eGN8Br1B6PM8B-uadkk1qomaokeK0B21eu');

console.log("\n[API] Loading...");
let startAll = Date.now();
getFiles(`${process.cwd()}/routes/api/`, "/", true);
console.log(`[API] Finished loading - took ${chalk.blue(`${Date.now() - startAll}ms`)}\n`);

function getFiles(filepath, apipath, first = false) {
    let allFiles = fs.readdirSync(filepath, { withFileTypes: true });
    let files = allFiles
        .filter((f) => f.name.split(".").pop() == "js")
        .map((f) => f.name);
    files.forEach((file) => {
        addPath(file, filepath, apipath);
    });

    let dirs = allFiles
        .filter((dirent) => !dirent.isFile())
        .map((dirent) => dirent.name);


    dirs.forEach((dir) => {
        if (dir == "u") return;
        let endpath = apipath;
        if (!first)
            endpath += `${dir}/`;


        getFiles(`${filepath}${dir}/`, endpath);
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
            if (!api.dynamic.startsWith("/")) api.dynamic = "/" + api.dynamic
            endPath += api.dynamic
        }
    }

    for (let key in api.type) {
        router[key ? key.toLowerCase() : "get"](endPath, jsonParser, urlencodedParser, async (req, res) => {

            let endpointStatus = await tools.endpoints(fileName);
            if (process.env.APP_DEBUG == "true") console.log(`[API] Status from "${fileName}" is "${endpointStatus}"`);
            if (endpointStatus == false) {
                return res.status('503').send({
                    status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
                }, null, 3);
            }

            try {
                await api.type[key](req, res, fileName, tools)
            } catch (err) {
                //Log error if debug mode is enabled
                if (process.env.APP_DEBUG == "true") console.error(err);

                pool.query(`UPDATE endpoints SET status = 0 WHERE name = "${fileName}"`, function (err, result, fields) {
                    const embed = {
                        "title": `API Internal Server Error (${fileName})`,
                        "description": `The system has noticed that there is an internal server error and has therefore switched off ${fileName}.`,
                        "color": 16711680,
                        "author": {
                            "name": "System",
                            "url": `https://evergene.io/api/${fileName}`,
                            "icon_url": "https://cdn.evergene.io/website/evergene-logo.png"
                        }
                    };

                    webhookClient.send({
                        username: 'Evergene System',
                        avatarURL: 'https://cdn.evergene.io/website/evergene-logo.png',
                        embeds: [embed],
                    });
                });

                //return error on error
                return res.status('500').send({
                    status: 500, reason: "Internal Server Error", msg: "please contact a administrator", url: "https://http.cat/500"
                }, null, 3);
            }
        });
        if (process.env.APP_DEBUG == "true") console.log(`[API] Loaded "${chalk.yellow(filename)}" as ${chalk.yellow(`api${endPath} (${key.toUpperCase()})`)} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
    }
}



module.exports = router;