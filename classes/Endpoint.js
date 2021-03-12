const chalk = require("chalk");
const Express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pool = require('../database/connection.js');
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

    //Methods
    static GET = 0;
    static POST = 1;
    static PUT = 2;
    static PATCH = 3;
    static DELETE = 4;

    //Connection
    static con = require('../database/connection');

    /**
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
     * @param {Express.Application} server Server
     * @param {String} fileName the endpoint name
     * @param {Object} config Endpoint config
     * @param {Number} config.method Endpoint mehtod
     * @param {String} [config.dynamic=false] Dynamic route
     * @param {String} [path=/] Path to use
     * @param {Function} execute Code to execute on request
     * @param {String} [logName=ENDPOINT] Name to use in the console log
     * @param {Boolean} [register=true] register endpoint or just setup class
     */
    constructor(server, fileName, { method, dynamic, path } = {}, code, logName = "ENDPOINT", register = true) {
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
        if (!code || typeof code != "function") {
            if (!code) throw new Error("There was no function provided");
            throw new Error(`Expected a function but received "${typeof code}"`);
        }
        if (!logName || typeof logName != "string") {
            if (!logName) throw new Error("There was no logName provided");
            throw new Error(`Expected a string but received "${typeof logName}"`);
        }
        if (register == undefined || typeof register != "boolean") {
            if (register == undefined) throw new Error("There was no boolean provided");
            throw new Error(`Expected a boolean but received "${typeof register}"`);
        }

        this._path = path || this.path;
        this._method = method || this.method;
        this._dynamic = dynamic || this.dynamic;

        this._code = code;

        if (this.dynamic) {
            if (!this.dynamic.startsWith("/")) this.dynamic = "/" + this.dynamic;
            this._path += this.dynamic;
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
}