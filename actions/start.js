const Embed = require("./Embed.js");

new Embed(process.env.ID, process.env.NAME, Embed[process.env.MODE], {
    webID: process.env.WEBHOOK_ID,
    webTOKEN: process.env.WEBHOOK_TOKEN
},"./actions/temp.txt", Date.now());