const fetch = require('node-fetch');
const fs = require('fs');
const Discord = require("discord.js");
const dotenv = require('dotenv');
dotenv.config();


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
     * @param {Object} webhookConfig the webhook config
     * @param {String} webhookConfig.webID the webhook id
     * @param {String} webhookConfig.webTOKEN the webhook token
     * @param {String} path path to file
     * @param {Any} [value] the value to write
     * @param {String} [appMode] the appMode
     */
    constructor(id, name, type, { webID, webTOKEN } = {}, path, value, appMode = "production") {
        webID = "813143436621643806";
        webTOKEN = "CZBAIJBwv2AiKAl7NfGTLmHigLhjS9P_X_eGN8Br1B6PM8B-uadkk1qomaokeK0B21eu";

        if(appMode == "dev") return;
        if (!id || id.length != 18 || parseInt(id) == NaN) throw new Error("Invalid ID!");
        if (!name) throw new Error("There was no name provided!");
        if (!webID) throw new Error("There was no WebhookID provided!");
        if (!webTOKEN) throw new Error("There was no WebhookTOKEN provided!")
        if (type == undefined || parseInt(type) == NaN) throw new Error("Invalid type!");
        if (!path || typeof path != "string") throw new Error("Invalid Path");

        let time;
        const embed = new Discord.MessageEmbed();

        switch (type) {
            case 0:
                if (!value) throw new Error("No value was provided!");
                Embed.saveValue(path, `${value}`);
                embed.setTitle(`» ${name} - Starting`).setFooter(`Loading...`).setColor("YELLOW");
                break;
            case 1:
                time = Embed.loadValue(path);
                let lastStart = Date.now();
                let tookStart = Embed.formatTime(Date.now() - time);

                embed.setTitle(`» ${name} - Started`).setColor("GREEN");
                Embed.infos(`./actions/data/${name}.json`, { lastStart, tookStart }, embed);
                break;
            case 2:
                if (!value) throw new Error("No value was provided!");
                Embed.saveValue(path, `${value}`);
                embed.setTitle(`» ${name} - Stopping`).setFooter(`Loading...`).setColor("YELLOW");
                break;
            case 3:
                time = Embed.loadValue(path);
                embed.setTitle(`» ${name} - Stopped`).setFooter(`Took ▸ ${Embed.formatTime(Date.now() - time)}`).setColor("RED");
                Embed.saveValue(`./actions/data/${name}.json`, JSON.stringify({
                    lastStop: Date.now(),
                    tookStop: Embed.formatTime(Date.now() - time),
                }, null, 4));
                break;
        }

        fetch(Embed.getURL(id, webID, webTOKEN), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ embeds: [embed] })
        });
    }

    /**
     * @param {String} id the message id
     * @param {String} webID the webhookID
     * @param {String} webTOKEN the webhookTOKEN
     * @param {Boolean} [noMessage] geht string without message param
     */
    static getURL(id, webID, webTOKEN, noMessage = false) {
        let out =  `https://discord.com/api/webhooks/${webID}/${webTOKEN}`;
        if(!noMessage) out += `/messages/${id}`;
        return out;
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
        return fs.readFileSync(path, "utf-8");
    }

    /**
     * @param {String} path path to the info json
     * @param {Discord.MessageEmbed} embed the message embed
     * @param {Object} startData the start data
     * @param {Number} startData.lastStart the current start date
     * @param {Number} startData.tookStart the current start time
     * @returns {String} information string
     */
    static infos(path, { lastStart, tookStart } = {}, embed) {
        let data = JSON.parse(Embed.loadValue(path));
        embed.addField("» Last Stop:", [Embed.formatDate(data.lastStop), `Took ▸ ${data.tookStop}`]);
        embed.addField("» Last Start:", [Embed.formatDate(lastStart), `Took ▸ ${tookStart}`]);
        return embed;
    }

    /**
     * @param {Number} time time in ms
     * @returns {String} returns the formatted time.
     */
    static formatTime(ms) {
        if (parseInt(ms) == NaN) return "Error";
        var remaining = ms;
        var times = [];
        var result = null;

        var days = Math.floor(remaining / 1000 / 60 / 60 / 24);
        if (days > 0) {
            remaining -= days * 1000 * 60 * 60 * 24;
            times.push(`${days} day${days > 1 ? "s" : ""}`);
        }
        var hours = Math.floor(remaining / 1000 / 60 / 60);
        if (hours > 0) {
            remaining -= hours * 1000 * 60 * 60;
            times.push(`${hours} hour${hours > 1 ? "s" : ""}`);
        }
        var minutes = Math.floor(remaining / 1000 / 60);
        if (minutes > 0) {
            remaining -= minutes * 1000 * 60;
            times.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
        }
        var seconds = Math.floor(remaining / 1000);
        if (seconds > 0) {
            remaining -= seconds * 1000;
            times.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
        }
        var ms = Math.floor(remaining);

        times = times.reverse();

        switch (times.length) {
            case 0:
                result = `${ms}ms`
                break;
            case 1:
                result = `${times[0]}`;
                break;
            case 2:
                result = `${times[1]} and ${times[0]}`;
                break;
            case 3:
                result = `${times[2]}, ${times[1]} and ${times[0]}`;
                break;
            case 4:
                result = `${times[3]}, ${times[2]}, ${times[1]} and ${times[0]}`;
                break;
        }

        return result;
    };

    /**
      * format a certain Date
      * @param {Date} date the date to format
      * @returns {String}
      */
    static formatDate(date) {
        if (date && date instanceof Date) {
            throw TypeError(`Expected a Date but recived "${typeof date}"!`);
        }

        let formatDate = new Date(date) || new Date();

        return `${formatDate.getMonth() + 1 < 10 ? "0" : ""
            }${formatDate.getMonth() + 1}/${formatDate.getDate() < 10 ? "0" : ""}${formatDate.getDate()}/${formatDate.getFullYear()} at ${formatDate.getHours() < 10 ? "0" : ""
            }${formatDate.getHours()}:${formatDate.getMinutes() < 10 ? "0" : ""
            }${formatDate.getMinutes()}`;
    }
}