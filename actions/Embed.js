const fetch = require('node-fetch');
const mysql = require('mysql');
const dotenv = require('dotenv');
const { MessageEmbed } = require("discord.js");
dotenv.config();
const fs = require('fs');
const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
});


module.exports = class Embed {

    //Types
    static STARTING = 0;
    static STARTED = 1;
    static STOPPING = 2;
    static STOPPED = 3;

    /**
     * @param {String} id The message ID
     * @param {String} name the embed name
     * @param {Number} type The embed type
     * @param {String} path path to file
     * @param {Any} [value] the value to write
     */
    constructor(id, name, type, path, value) {
        if(!id || id.length != 18 || parseInt(id) == NaN) throw new Error("Invalid ID!");
        if(!name) throw new Error("There was no name provided!");
        if(!type || parseInt(type) == NaN) throw new Error("Invalid type!");
        if(!path || typeof path != "string") throw new Error("Invalid Path");
        
        let time;
        let embed = new MessageEmbed();
        switch(type) {
            case 0:
                if(!value) throw new Error("No value was provided!");
                Embed.saveValue(path, value);
            break;
            case 1:
                time = Embed.loadValue(path);
            break;
            case 2:
                if(!value) throw new Error("No value was provided!");
                Embed.saveValue(path, value);
            break;
            case 3:
                time = Embed.loadValue(path);
            break;
        }
    }

    /**
     * @param {String} id the message id
     */
    static getURL (id) {
        return `https://discord.com/api/v8/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}/messages/${id}`
    }

    /**
     * @param {String} path path to the file
     * @param {Any} value value to write
     */
    static saveValue(path, value) {
        fs.writeFileSync(path, value);
    }

    /**
     * @param {String} path path to the file
     * @returns {Any} file value
     */
    static loadValue(path) {
        return fs.readFileSync(path);
    }
}