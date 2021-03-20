const Endpoint = require("./Endpoint.js");

const chalk = require("chalk");
const Express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pool = require('../database/connection.js');
const tools = require("../functions.js");

/**
 * Main Endpoint
 * @author @NewtTheWolf @CuzImStantac
 */

module.exports = class MainEndpoint extends Endpoint {

    /**
    * @param {Express.Application} server Server
    * @param {String} fileName the endpoint name
    * @param {Object} config Endpoint config
    * @param {Number} config.method Endpoint mehtod
    * @param {String} [config.dynamic=false] Dynamic route
    * @param {String} [path=/] Path to use
    * @param {Function} execute Code to execute on request
    * @param {Boolean} [authFunction] function to authorize the user
    */
    constructor(server, fileName, { method, dynamic, path } = {}, perms, code, authFunction = false) {
        super(server, fileName, { method, dynamic, path }, perms, code, "MAIN-ENDPOINT", false);
        this.authFunction = async (req, res, next) => {
            return next()
        }

        if (authFunction) this.authFunction = tools.forceAuth;

        let fileStart = Date.now();
        try {
            let endMethod = this.register(server, fileName);
            if (process.env.APP_DEBUG == "true") console.log(`[MAIN-ENDPOINT] Registered "${chalk.yellow(fileName)}" as ${chalk.yellow(`${this.path} (${endMethod.toUpperCase()})`)} - took ${chalk.blue(`${Date.now() - fileStart}ms`)}`);
        } catch (e) {
            return console.log(`[MAIN-ENDPOINT] Failed to register "${chalk.yellow(fileName)}"! ${e.name}: ${chalk.red(e.message)}`);
        }
    }

    /**
    * function to register the endpoint
    * @param {Express.Application} server Server
    * @param {String} filename the filename without extension
    * @returns {String} endMethod as string
    */
    register(server, filename) {
        let version = require('../package.json').version;
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

        server[endMethod.toLowerCase()](this.path, this.authFunction, async (req, res) => {
            try {

                //let lang = tools.checkCookie(req, res)

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

                filename = filename.split(".").shift().toLowerCase()
                let title = filename.slice(0, 1).toUpperCase() + filename.slice(1).toLowerCase()
                await this.code(req, res, filename, /*Lang >*/null, version, title, req.session.user || null);
            } catch (err) {
                //Log error if debug mode is enabled
                if (process.env.APP_DEBUG == "true") console.error(err);

                //return error on error
                if (req.header('accept').split(',')[0].split('/')[1] == 'html') {
                    return res.render('500', { version: version, pageTitle: '500', user: req.session.user || null });
                } else {
                    res.header("Content-Type", "application/json");
                    return res.status('500').send({
                        status: 500, reason: "Internal Server Error", url: "https://http.cat/500"
                    }, null, 3);
                }

            }
        });

        return endMethod;
    }
}