const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql');
const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
});
const CronJob = require('cron').CronJob;

async function check() {
    con.query('SELECT * FROM endpoints', async function (error, results) {
        if (error) throw error;
        for (i = 0; ; i++) {
            if (i === results.length) break;
            const endpoint = results[i].name;
            if (endpoint == 'endpoint') break;
            if (endpoint == 'partner') break;
            const start = Date.now();
            await fetch(`https://evergene.io/api/${endpoint}`)
                .then(res => {
                    if (res.status === 503) {
                        con.query(`UPDATE endpoints SET ping = ${Date.now() - start} WHERE name = "${endpoint}"`, function (err, result) {
                            if (err) throw err;
                        });
                    } else if (res.status === 200) {
                        con.query(`UPDATE endpoints SET ping = ${Date.now() - start} WHERE name = "${endpoint}"`, function (err, result) {
                            if (err) throw err;
                        });
                    }
                })
        }
        console.log('end')
    });
}

async function update() {
    con.query('SELECT * FROM endpoints', async function (error, results) {
        if (error) throw error;
        const fields = [];
        for (i = 0; ; i++) {
            if (i === results.length) break;
            const endpoint = results[i].name;
            if (endpoint == 'endpoint') continue;
            if (endpoint == 'partner') continue;
            if (results[i].status) {
                fields.push({ name: `<:true:813187554279030784> ${endpoint.slice(0, 1).toUpperCase() + endpoint.slice(1)}`, value: `${results[i].ping}ms`, inline: true });
            } else {
                fields.push({ name: `<:false:813187499907612723> ${endpoint.slice(0, 1).toUpperCase() + endpoint.slice(1)}`, value: `Deactivated`, inline: true });
            }
        }
        console.log(fields);
        const embed = {
            embeds: [{
                title: `Enpoint Status`,
                description: `Here you can monitor the status of all endpoints`,
                color: 13311,
                fields: fields,
                author: {
                    name: "Evergene System",
                    url: `https://evergene.io/`,
                    icon_url: "http://localhost:3002/website/evergene-logo.png"
                }
            }]
        };

        fetch(`https://discord.com/api/v8/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}/messages/813418848015351818`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(embed),
        })
            .then(res => res.json())
            .then(json => console.log(json));
    });
}
const job = new CronJob('*/10 * * * *', function () {
    check()
    update()
}, null, true, 'Europe/Berlin');


job.start();