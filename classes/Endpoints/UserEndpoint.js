const Endpoint = require("./Endpoint");
const { checkKey } = require("../../functions.js");

/** 
 * Register a UserEndpoint
 * @author @CuzImStantac
 * TODO: Check Key, load Private folder, get user perms via id
 */
module.exports = class UserEndpoint extends Endpoint {
    _userID = null;
    _ownerKey = null;
    _isPrivate = false;
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
    * The UserEndpoint owner key
    * @type {String}
    */
    get ownerKey() {
        return this._ownerKey;
    }
    set ownerKey(ownerKey) {
        this._ownerKey = ownerKey;
    }

    /**
    * endpoint private?
    * @type {Boolean}
    */
    get isPrivate() {
        return this._isPrivate;
    }
    set isPrivate(isPrivate) {
        this._isPrivate = isPrivate;
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
    * @param {String} ownerKey the Userendpoint owner key
    * @param {Boolean} private endpoint private?
    * @param {Array<String>} keys trusted API-Keys
    */
    constructor(server, { method, dynamic, path } = {}, code, userID, ownerKey, isPrivate, keys) {
        super(server, fileName, { method, dynamic, path } = {}, false, code, "USER-ENDPOINT", false);
        if (userID && typeof userID != "string") {
            throw new Error(`Expected a string but received "${typeof userID}"`);
        }
        if (ownerKey && typeof ownerKey != "string") {
            throw new Error(`Expected a string but received "${typeof ownerKey}"`);
        }
        if (isPrivate && typeof isPrivate != "boolean") {
            throw new Error(`Expected a string but received "${typeof isPrivate}"`);
        }
        if (keys && !keys instanceof Array) {
            throw new Error(`Expected a array but received "${typeof keys}"`);
        }

        console.log(this);
    }

    /** 
     * Return the premium type of a user
     * @returns {Number}
     * @async
     */
     async premiumCheck() {
         const perms = { 
             premium: 32 
            }; //! Sort from highest to lowest tier

         let entry = await checkKey(this.ownerKey);
         let out = false;

         if(entry.key) {
            for(let tier in perms) {
                if(entry.perms & perms) {
                    out = tier;
                    break;
                } 
            }
        };

         return out
    }

    /**
     * check if a certain key is trusted
     * 
     */

    isKeyTrusted(key) {

    }


}