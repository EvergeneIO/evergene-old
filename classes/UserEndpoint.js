const Endpoint = require("./Endpoint")

/** 
 * Register a UserEndpoint
 * @author @CuzImStantac
 */
module.exports = class UserEndpoint extends Endpoint {
    _userID = null;
    _keys = [];

    /**
    * The UserEndpoint owner id
    * @type {String}
    */
    get userID() {
        return this._userID;
    }
    set userID(userID) {
        this._userID = userID;
    }

    /**
    * trusted API-Keys
    * @type {Array}
    */
    get keys() {
        return this._keys;
    }
    set keys(keys) {
        this._keys = keys;
    }

    /**
    * @param {Object} config Endpoint config
    * @param {Number} config.method Endpoint mehtod
    * @param {String} [config.dynamic=false] Dynamic route
    * @param {String} [path=/] Path to use
    * @param {Function} execute Code to execute on request
    * @param {String} userID The UserEndpoint owner id
    * @param {Array<String>} keys trusted API-Keys
    */
    constructor({ method, dynamic, path } = {}, code, userID, keys) {
        super({ method, dynamic, path }, code);
        
        if (userID && typeof userID != "string") {
            throw new Error(`Expected a string but received "${typeof userID}"`);
        }
        if (keys && !keys instanceof Array) {
            throw new Error(`Expected a array but received "${typeof keys}"`);
        }

        console.log(this);
    }
    premiumCheck() {
    }
}