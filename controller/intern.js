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
const Endpoint = require("../classes/Endpoints/Endpoint");

console.log("\n[INTERN] Loading...");
let startAll = Date.now();
Endpoint.loadEndpointNames('intern').then(() => {
    getFiles(`${process.cwd()}/routes/api/intern/`, "/", true);
    Endpoint.endpointTempCache.cache.forEach((e) => {
        Endpoint.endpointTempCache.removed.push(e);
        Endpoint.con.query(`DELETE FROM endpoints WHERE name = "${e}"`);
    });
    console.log(chalk.magentaBright("\n› Auto-Migration [INTERN]"))
    console.log(`${chalk.greenBright(`Added: [${chalk.yellowBright(Endpoint.endpointTempCache.added.length)}]`)}\n${Endpoint.endpointTempCache.added.map(e => `${chalk.greenBright("+")} ${e}`).join("\n") || "None"}\n`);
    console.log(`${chalk.redBright(`Removed: [${chalk.yellowBright(Endpoint.endpointTempCache.removed.length)}]`)}\n${Endpoint.endpointTempCache.removed.map(e => `${chalk.redBright("-")} ${e}`).join("\n") || "None"}\n`);

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
            //if (!first)
            endpath += `${dir}/`;


            getFiles(`${filepath}${dir}/`, endpath);
        });
    }


    // TODO: Automatische Endpoint migration im handler automatisch adden wenn nicht registriert / removen wenn nicht mehr da >> .env
    //! SELECT * FROM endpoint (WHERE name = "${nameVar}") 
    async function addPath(filename, filepath, path) {
        path = path.toLowerCase();
        filename = filename.split(".")[0];
        Endpoint.checkEndpoint(filename, 'intern');
        let fileStart = Date.now();
        try {
            require(`${filepath}${filename}`)(router, filename, `${path}${filename}`);
        } catch (e) {
            return console.log(`[INTERN] Failed to load "${chalk.yellow(filename)}"! ${e.name}: ${chalk.red(e.message)}`);
        }

        if (process.env.APP_DEBUG == "true") console.log(`[INTERN] Loaded "${chalk.yellow(filename)}" - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
    }
});


module.exports = router;