const fetch = require('node-fetch');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
});

fs.writeFileSync('stop.txt', `${Date.now()}`)

const embed = {
    embeds: [{
        title: `System Stoping...`,
        color: 16711680,
    }]
};

fetch(`https://discord.com/api/v8/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}/messages/813418805736505375`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(embed),
})
    .then(res => res.json())
    .then(json => console.log(json));