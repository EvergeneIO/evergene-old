const Express = require('express');

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
     * @param {Object} config Endpoint config
     * @param {Number} config.method Endpoint mehtod
     * @param {String} [config.dynamic=false] Dynamic route
     * @param {String} [path=/] Path to use
     * @param {Function} execute Code to execute on request
     */
    constructor({ method, dynamic, path } = {}, code) {
        if (method && typeof method != "number") {
            throw new Error(`Expected a number but received "${typeof method}"`);
        }
        if (dynamic && typeof dynamic != "string") {
            throw new Error(`Expected a string but received "${typeof dynamic}"`);
        }

        this._method = method || this.method;
        this._dynamic = dynamic || this.dynamic;


    }

    /** 
     * Handle Api routing
     * @param {Express.Application} server Server
     */
    static router(server) {
        
        // '/api'
        server.use('/api', require('../handler/api'));

        // '/user-api'
        server.use('/api/u', require('../handler/user-api'));

        // '/authorize'
        server.use('/authorize', require('../handler/authorize'));

        server.use('/test', require('../routes/test'));

        server.use(require('../database/migration'));
    }
}