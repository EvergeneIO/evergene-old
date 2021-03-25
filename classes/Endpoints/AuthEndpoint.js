const Endpoint = require("./Endpoint.js");

const chalk = require("chalk");
const Express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pool = require('../../database/connection.js');
const tools = require("../../functions.js");

/**
 * Auth Endpoint
 * @author @NewtTheWolf @CuzImStantac
 */

module.exports = class AuthEndpoint extends Endpoint {

     /**
     * @param {Express.Application} server Server
     * @param {String} fileName the endpoint name
     * @param {Object} config Endpoint config
     * @param {Number} config.method Endpoint mehtod
     * @param {String} [config.dynamic=false] Dynamic route
     * @param {String} [path=/] Path to use
     * @param {Function} execute Code to execute on request
     */
    constructor(server, fileName, { method, dynamic, path } = {}, code) {
        super(server, fileName, { method, dynamic, path }, false, code, "AUTH-ENDPOINT");
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

        server[endMethod.toLowerCase()](this.path, jsonParser, urlencodedParser, async (req, res) => {
            try {
                res.removeHeader("X-Powered-By");
                //res.removeHeader("ETag");
                await this.code(req, res, fileName, tools);
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