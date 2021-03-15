const { makeid, checkKey } = require("../../../functions");
const Endpoint = require('../../../classes/MainEndpoint');

const pool = require(`${process.cwd()}/database/connection`);

module.exports = (router, filename, path) => {
    new Endpoint(router, filename, {
        method: Endpoint.GET,
        path
    }, null,
        async (req, res, filename, lang, version, title, user) => {
            pool.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
                if (err) {
                    console.log('Error in DB');
                    console.error(err);
                    return;
                } else {
                    if (result && result.length) {
                        pool.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
                            if (err) throw err;
                            const json = JSON.stringify(result);
                            const obj = JSON.parse(json);
                            const token = obj[0].token;
                            let guildName = JSON.stringify(req.session.guildName);

                            console.log('SELECT AND RENDER');
                        });
                    } else {
                        let token = makeid(24);
                        pool.query(`INSERT INTO user (discordId, token, perms) VALUES ("${req.session.user.id}", "${token}", 1)`, function (err, result) {
                            if (err) throw err;
                            console.log('INSERT AND RENDER');

                        });
                    }
                }
            });
            pool.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
                if (err) throw err;
                const json = JSON.stringify(result);
                const obj = JSON.parse(json);
                let token = obj[0].token;
                (async () => {
                    let key = await checkKey(token);
                    let permsJson = JSON.stringify(key);
                    let permsObj = JSON.parse(permsJson);
                    let perms = permsObj.perms;
                    if (perms & 2) {
                        if (req.param('key') == 'reset') {

                            res.render('settings', { version: version, pageTitle: 'Settings', lang: lang, user: req.session.user, alert: 'reset', nsfw: false || null });
                        } else if (req.param('key') == 'request') {

                            res.render('settings', { version: version, pageTitle: 'Settings', lang: lang, user: req.session.user, alert: 'request', nsfw: false || null });
                        } else {

                            res.render('settings', { version: version, pageTitle: 'Settings', lang: lang, user: req.session.user, alert: false, nsfw: false || null });
                        }
                    } else {
                        if (req.param('key') == 'reset') {

                            res.render('settings', { version: version, pageTitle: 'Settings', lang: lang, user: req.session.user, alert: 'reset', nsfw: true || null });
                        } else if (req.param('key') == 'request') {

                            res.render('settings', { version: version, pageTitle: 'Settings', lang: lang, user: req.session.user, alert: 'request', nsfw: true || null });
                        } else {

                            res.render('settings', { version: version, pageTitle: 'Settings', lang: lang, user: req.session.user, alert: false, nsfw: true || null });
                        }
                    }
                })()
            })
        }, true
    )
}
