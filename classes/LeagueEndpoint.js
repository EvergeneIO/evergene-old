const Endpoint = require("./Endpoint.js");

const chalk = require("chalk");
const Express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pool = require('../database/connection.js');
const tools = require("../functions.js");
const fetch = require("node-fetch");
const { schedule } = require("node-cron");
const fs = require("fs");

/**
 * Api Endpoint
 * @author @NewtTheWolf @CuzImStantac
 */


module.exports = class LeagueEndpoint extends Endpoint {
    static _categories = {};
    static _blackList = ["annie", "lulu", "yuumi", "zoe"];
    static _ready = false;
    static _cron = null;

    /**
    * @param {Express.Application} server Server
    * @param {String} fileName the endpoint name
    * @param {Object} config Endpoint config
    * @param {Number} config.method Endpoint mehtod
    * @param {String} [config.dynamic=false] Dynamic route
    * @param {String} [path=/] Path to use
    * @param {Function} execute Code to execute on request
    */
    constructor(server, fileName, { method, dynamic, path } = {}, perms, code) {
        super(server, fileName, { method, dynamic, path }, perms, code, "ENDPOINT");
    }

    /**
     * function to register the endpoint
     * @param {Express.Application} server Server
     * @param {String} filename the filename without extension
     * @returns {String} endMethod as string
     * @async
     */
    register(server, filename) {
        let endMethod;
        switch (this._method) {
            default:
                throw new Error("Unknown method");
            case 0: //? GET
                endMethod = "get";
                break;
            case 1: //? POST
                endMethod = "post";
                break;
            case 2: //? PUT
                endMethod = "put";
                break;
            case 3: //? PATCH
                endMethod = "patch";
                break;
            case 4: //? DELETE
                endMethod = "delete";
                break;
        }

        server[endMethod.toLowerCase()](this.path, jsonParser, urlencodedParser, async (req, res) => {

            try {
                //res.removeHeader("ETag");
                res.removeHeader("X-Powered-By");
                let endpointStatus = await tools.endpoints(filename);
                if (process.env.APP_DEBUG == "true") console.log(`[API-ENDPOINT] Status from "${chalk.yellow(filename)}" is "${chalk.blue(endpointStatus)}"`);
                if (endpointStatus == false) {
                    res.header("Content-Type", "application/json");
                    return res.status('503').send({
                        status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
                    }, null, 3);
                }

                if (typeof this._perm == "number") {
                    let hasPerm = await Endpoint.checkKey(req.header("Authorization"), this._perm)
                    if (!hasPerm) {
                        res.header("Content-Type", "application/json");
                        return res.status('401').send({
                            status: 401, reason: "Unauthorized", msg: req.header("Authorization") ? "Not enough permissions!" : "No or invalid API-Key provided!", url: "https://http.cat/401"
                        }, null, 3);
                    }
                }

                await this.code(req, res, filename, tools);
            } catch (err) {
                //Log error if debug mode is enabled
                if (process.env.APP_DEBUG == "true") console.error(err);

                pool.query(`UPDATE endpoints SET status = 0 WHERE name = "${fileName}"`, function (err, result, fields) {
                    //  const embed = {
                    //      "title": `API Internal Server Error (${fileName})`,
                    //      "description": `The system has noticed that there is an internal server error and has therefore switched off ${fileName}.`,
                    //      "color": 16711680,
                    //      "author": {
                    //          "name": "System",
                    //          "url": `https://evergene.io/api/${fileName}`,
                    //          "icon_url": "https://cdn.evergene.io/website/evergene-logo.png"
                    //      }
                    //  };

                    //  webhookClient.send({
                    //      username: 'Evergene System',
                    //      avatarURL: 'https://cdn.evergene.io/website/evergene-logo.png',
                    //      embeds: [embed], 
                    //  });
                });

                //return error on error

                res.removeHeader("Connection");
                res.removeHeader("ETag");
                res.removeHeader("X-Powered-By");
                res.header("Content-Type", "application/json");
                return res.status('500').send({
                    status: 500, reason: "Internal Server Error", msg: "please contact a administrator", url: "https://http.cat/500"
                }, null, 3);
            }
        });

        return endMethod;
    }

    /**
     * regusters all categories
     * @async
     */
    static async setup() {
        if (process.env.APP_MODE != "production") return console.log('[LEAGUE-ENDPOINT] League-Endpoint only available in "production" mode');
        console.log("[LEAGUE-ENDPOINT] Registering categories...");
        let now = Date.now();

        let results = [null]

        for (let page = 1; results.length <= 100 && results.length > 0; page++) {
            try {

                results = await (await fetch(`https://league-of-hentai.com/wp-json/wp/v2/tags?page=${page}&per_page=100`)).json();

                results.forEach(async (result) => {
                    let slug = result.slug;
                    let id = result.id;
                    let count = result.count;
                    if (LeagueEndpoint._blackList.includes(slug)) return;
                    LeagueEndpoint._categories[slug] = { id, count, images: [] };
                });
            } catch (e) { }
        }
        LeagueEndpoint._ready = true;
        console.log(`[LEAGUE-ENDPOINT] Registered ${chalk.yellow(Object.keys(LeagueEndpoint._categories).length)} categorie${Object.keys(LeagueEndpoint._categories).length == 1 ? "" : "s"} and ${chalk.yellow(Object.values(LeagueEndpoint._categories).reduce((a, b) => a + b.images.length, 0))} image${Object.values(LeagueEndpoint._categories).reduce((a, b) => a + b.images.length, 0) == 1 ? "" : "s"} in ${chalk.blue(`${Date.now() - now}ms`)}`);

        LeagueEndpoint._cron = schedule("0 */12 * * *", async () => {
            LeagueEndpoint._ready = false;
            LeagueEndpoint._categories = {};
            console.log("[LEAGUE-ENDPOINT] Refreshing categories...");
            let now = Date.now();

            let results = [null]

            for (let page = 1; results.length <= 100 && results.length > 0; page++) {
                try {

                    results = await (await fetch(`https://league-of-hentai.com/wp-json/wp/v2/tags?page=${page}&per_page=100`)).json();

                    results.forEach(async (result) => {
                        let slug = result.slug;
                        let id = result.id;
                        let count = result.count;
                        if (LeagueEndpoint._blackList.includes(slug)) return;
                        LeagueEndpoint._categories[slug] = { id, count, images: [] };
                    });
                } catch (e) { }
            }
            LeagueEndpoint._ready = true;
            console.log(`[LEAGUE-ENDPOINT] Refreshed ${chalk.yellow(Object.keys(LeagueEndpoint._categories).length)} categorie${Object.keys(LeagueEndpoint._categories).length == 1 ? "" : "s"} and ${chalk.yellow(Object.values(LeagueEndpoint._categories).reduce((a, b) => a + b.images.length, 0))} image${Object.values(LeagueEndpoint._categories).reduce((a, b) => a + b.images.length, 0) == 1 ? "" : "s"} in ${chalk.blue(`${Date.now() - now}ms`)}`);
        })
        console.log("[LEAGUE-ENDPOINT] Started cron job...")
    }


    static filter(methode = "check", postID = "0000") {
        if(!(methode || postID || ["add", "remove", "check"].includes(methode))) return false;
        let temp = null;
        switch (methode) {
            case "add":
                if(this.filter("check", postID)) return;
                fs.appendFileSync("./classes/data/league/filtered.txt", `${postID};`);
                break;
            case "remove":
                if(!this.filter("check", postID)) return;
                temp = fs.readFileSync("./classes/data/league/filtered.txt", "utf-8");
                temp = temp.split(";");
                temp.splice(temp.indexOf(postID.toString()), 1);
                fs.writeFileSync("./classes/data/league/filtered.txt", temp.join(";"));
                break;
            case "check":
                temp = fs.readFileSync("./classes/data/league/filtered.txt", "utf-8");
                temp = temp.split(";");
                return temp.some(id => id == postID)
                break;
        }
    }
}