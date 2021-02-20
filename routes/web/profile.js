const pool = require( `${process.cwd()}/database/connection`);
module.exports = {
    auth: true,
    execute: async (req, res, filename, lang, version, title, user) => {
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

                        res.render('profile', { token: token, version: version, pageTitle: 'Profile', lang: lang, user: req.session.user, guildName: guildName || null });
                    });
                } else {
                    let token = tools.makeid(24);
                    pool.query(`INSERT INTO user (discordId, token, perms) VALUES ("${req.session.user.id}", "${token}", 1)`, function (err, result) {
                        if (err) throw err;
                        console.log('INSERT AND RENDER');

                        res.render('profile', { token: token, version: version, pageTitle: 'Profile', lang: lang, user: req.session.user, guildName: req.session.guildName || null });
                    });
                }
            }
        });
    }
};