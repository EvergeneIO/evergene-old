const Express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Api Handler
 * @author @NewtTheWolf @CuzImStantac
 */

/**
 * Main = Api
 * Interne = Api
 * Auth
 * User
 */

module.exports = class Endpoint {
    _method = 0;
    _dynamic = null;
    _path = "/"

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
     * @param {Express.Application} server Server
     * @param {Object} config Endpoint config
     * @param {Number} config.method Endpoint mehtod
     * @param {String} [config.dynamic=false] Dynamic route
     * @param {String} [path=/] Path to use
     * @param {Function} execute Code to execute on request
     */
    constructor(server, { method, dynamic, path } = {}, code) {
        if (method && typeof method != "number") {
            throw new Error(`Expected a number but received "${typeof method}"`);
        }
        if (dynamic && typeof dynamic != "string") {
            throw new Error(`Expected a string but received "${typeof dynamic}"`);
        }
        if (path && typeof path != "string") {
            throw new Error(`Expected a string but received "${typeof path}"`);
        }

        this._path = path || this.path;
        this._method = method || this.method;
        this._dynamic = dynamic || this.dynamic;

        server[this.method.toLowerCase()](this.path, jsonParser, urlencodedParser, async (req, res) => {
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

               /* pool.query(`UPDATE endpoints SET status = 0 WHERE name = "${fileName}"`, function (err, result, fields) {
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
                });*/

                //return error on error
                return res.status('500').send({
                    status: 500, reason: "Internal Server Error", msg: "please contact a administrator", url: "https://http.cat/500"
                }, null, 3);
            }
        });
    }
}