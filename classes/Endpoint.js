const chalk = require("chalk");
const Express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const tools = require("../functions.js");


/**
 * Basic Endpoint
 * @author @NewtTheWolf @CuzImStantac
 */
module.exports = class Endpoint {
    _method = 0;
    _dynamic = null;
    _path = "/"
    _code = null;
    _perm = false;

    //Methods
    static GET = 0;
    static POST = 1;
    static PUT = 2;
    static PATCH = 3;
    static DELETE = 4;

    //Connection
    static con = require('../database/connection');
    static endpointTempCache = { cache: [], added: [], removed: [] }

    /**'
     * Method Type
     * @type {Number}
     */
    get method() {
        return this._method;
    }
    set method(method) {
        this._method = method;
    }

    /**
     * Dynamic path
     * @type {String}
     */
    get dynamic() {
        return this._dynamic;
    }
    set dynamic(dynamic) {
        this._dynamic = dynamic;
    }

    /**
     * Path
     * @type {String}
     */
    get path() {
        return this._path;
    }
    set path(path) {
        this._path = path;
    }

    /**
     * Code to execute
     * @type {Function}
     * @readonly
     */
    get code() {
        return this._code;
    }

    /**
     * Permissions of the key
     * @type {Number}
     */
    get perm() {
        return this._perm;
    }
    set perm(perm) {
        this._perm = perm;
    }

    /**
     * @param {Express.Application} server Server
     * @param {String} fileName the endpoint name
     * @param {Object} config Endpoint config
     * @param {Number} config.method Endpoint mehtod
     * @param {String} [config.dynamic=false] Dynamic route
     * @param {String} [path=/] Path to use
     * @param {Number} [perm=false] provide a perm that the user needs
     * @param {Function} execute Code to execute on request
     * @param {String} [logName=ENDPOINT] Name to use in the console log
     * @param {Boolean} [register=true] register endpoint or just setup class
     */
    constructor(server, fileName, { method, dynamic, path } = {}, perm = false, code, logName = "ENDPOINT", register = true) {
        let fileStart = Date.now();
        if (method && typeof method != "number") {
            throw new Error(`Expected a number but received "${typeof method}"`);
        }
        if (dynamic && typeof dynamic != "string") {
            throw new Error(`Expected a string but received "${typeof dynamic}"`);
        }
        if (path && typeof path != "string") {
            throw new Error(`Expected a string but received "${typeof path}"`);
        }
        if (perm != undefined && perm != false && typeof perm != "number") {
            throw new Error(`Expected a number but received "${typeof perm}"`);
        }
        if (!code || typeof code != "function") {
            if (!code) throw new Error("There was no function provided");
            throw new Error(`Expected a function but received "${typeof code}"`);
        }
        if (!logName || typeof logName != "string") {
            if (!logName) throw new Error("There was no logName provided");
            throw new Error(`Expected a string but received "${typeof logName}"`);
            x
        }
        if (register == undefined || typeof register != "boolean") {
            if (register == undefined) throw new Error("There was no boolean provided");
            throw new Error(`Expected a boolean but received "${typeof register}"`);
        }


        this._perm = perm || this.perm;
        this._path = path || this.path;
        this._method = method || this.method;
        this._dynamic = dynamic || this.dynamic;

        this._code = code;


        if (this._dynamic) {
            if (!this._dynamic.startsWith("/") && !this._path.endsWith("/")) this._dynamic = "/" + this._dynamic;
            this._path += this._dynamic;
        }

        if (!this._path.endsWith("/")) this._path += "/";

        if (register) {
            try {
                let endMethod = this.register(server, fileName);
                if (process.env.APP_DEBUG == "true") console.log(`[${logName}] Loaded "${chalk.yellow(fileName)}" as ${chalk.yellow(`${this.path} (${endMethod.toUpperCase()})`)} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
            } catch (e) {
                return console.log(`[${logName}] Failed to register "${chalk.yellow(fileName)}"! ${e.name}: ${chalk.red(e.message)}`);
            }
        } else {
            if (process.env.APP_DEBUG == "true") console.log(`[${logName}] Loaded "${chalk.yellow(fileName)}" - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
        }
    }

    /**
     * function to register the endpoint
     * @param {Express.Application} server Server
     * @param {String} filename the filename without extension
     * @returns {String} endMethod as string
     */
    register(server) {
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

        server[endMethod.toLowerCase()](this.path + filename != "index" ? filename : "", jsonParser, urlencodedParser, async (req, res) => {
            try {
                res.removeHeader("X-Powered-By");
                //res.removeHeader("ETag");
                if (typeof this._perm == "number") {
                    let hasPerm = await Endpoint.checkKey(req.header("Authorization"), this._perm)
                    if (!hasPerm) {
                        res.header("Content-Type", "application/json");
                        return res.status('401').send({
                            status: 401, reason: "Unauthorized", msg: req.header("Authorization") ? "Not enough permissions!" : "No or invalid API-Key provided!", url: "https://http.cat/401"
                        }, null, 3);
                    }
                }
                await this._code(req, res, filename, tools);
            } catch (err) {
                //Log error if debug mode is enabled
                if (process.env.APP_DEBUG == "true") console.error(err);

                //return error on error
                res.header("Content-Type", "application/json");
                return res.status('500').send({
                    status: 500, reason: "Internal Server Error", msg: "please contact a administrator", url: "https://http.cat/500"
                }, null, 3);
            }
        });

        return endMethod;
    }


    /**
     * Key = 0 = 401 (Unauthorized)
     * Key != Perm = 401 (Unauthorized)
     */

    /**
     * Check if key exists or has a certain permission
     * @param {String} key
     * @param {Number} [perm=1]
     * @async 
     */
    static async checkKey(key, perm = 1) {
        if (!key || typeof key != "string") return false;
        if (typeof perm != "number") throw Error(`Expected a Number but received "${typeof perm}"`)
        let entry = await tools.checkKey(key);

        if (entry.key && entry.perms & perm) return true

        return false;
    };

    static loadEndpointNames(table = "endpoints") {
        return new Promise((resolve, reject) => {
            console.log("[ENDPOINTS] Loading endpoint names...");
            Endpoint.con.query(`SELECT name FROM ${table}`, function (error, results, fields) {
                if(error) console.log('error ' + error)
                Endpoint.endpointTempCache.cache = results.map(r => r.name);
                console.log(`[ENDPOINTS] Loaded ${chalk.yellowBright(Endpoint.endpointTempCache.cache.length)} endpoint name${Endpoint.endpointTempCache.cache.length == 1 ? "" : "s"}...`);
                resolve(true);
            });
        });
    }

    static checkEndpoint(endpoint, table = "endpoints") {
        if (Endpoint.endpointTempCache.cache.includes(endpoint)) return Endpoint.endpointTempCache.cache.splice(Endpoint.endpointTempCache.cache.indexOf(endpoint), 1);
        if(!Endpoint.endpointTempCache.cache.includes(endpoint)){ Endpoint.con.query(`INSERT INTO ${table} (name) VALUES ("${endpoint}")`); Endpoint.endpointTempCache.added.push(endpoint); }

    }
}

