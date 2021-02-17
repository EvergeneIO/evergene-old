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


const load = (dirs) => {
    const apis = fs.readdirSync(`./routes/api/${dirs}/`).filter(f => f.endsWith(".js"));

    console.log(`[API] Loading "${dirs}"...`);
    let folderTime = Date.now();
    for (let file of apis) {
        let fileStart = Date.now()
        const fileName = file.split(".").shift().toLowerCase();
        const api = require(`../routes/api/${dirs}/${file}`);

        router[api.type ? api.type.toLowerCase() : "get"](`/${fileName}`, jsonParser, urlencodedParser, async (req, res) => {

            let status = await tools.endpoints(fileName);
            if (status != 1) {
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
        if (process.env.APP_DEBUG == "true") console.log(`[API] Loaded /${fileName} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
    }
    console.log(`[API] Loaded "${dirs}" - took ${chalk.blue(`${Date.now() - folderTime}ms`)}`)
}

console.log(`\n[API] Loading...`);
let startAll = Date.now();
fs.readdirSync("./routes/api").forEach(dirs => load(dirs))
console.log(`[API] Finished loading - took ${chalk.blue(`${Date.now() - startAll}ms`)}\n`);

module.exports = router;