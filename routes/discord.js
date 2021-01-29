const chalk = require('chalk');
console.log(chalk.yellow('OAtuh2 Client is starting...'))
const router = require('express').Router();
const fetch = require('node-fetch');
const FormData = require('form-data');
const { response } = require('express');
let mysql = require('mysql');
const { guildIcon } = require('canvacord/src/Canvacord');
let con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
});

// GENERATING NEW TOKEN
function makeid(length) {
    var result = '';
    var characters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ.0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const forceAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
}

router.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/');

    const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${process.env.SCOPES}`;
    res.redirect(authorizeUrl);
});

router.get('/callback', (req, res) => {
    if (req.session.user) return res.redirect('/');

    const accessCode = req.query.code;
    if (!accessCode) throw new Error('No access code returned from Discord');

    const data = new FormData();
    data.append('client_id', process.env.CLIENT_ID);
    data.append('client_secret', process.env.CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', process.env.REDIRECT_URI);
    data.append('scope', process.env.SCOPES);
    data.append('code', accessCode);

    fetch('https://discordapp.com/api/oauth2/token', {
        method: 'POST',
        body: data
    })
        .then(res => res.json())
        .then(response => {

            fetch('https://discordapp.com/api/users/@me/guilds', {
                method: 'GET',
                headers: {
                    authorization: `${response.token_type} ${response.access_token}`
                }

            })
                .then(res2 => res2.json())
                .then(guildResponse => {
                    let guildResponseLenght = guildResponse.length
                    let guildNameAray = []
                    for (let i = 0; i < guildResponseLenght; i++) {
                        //console.log(guildResponse[i]);
                        const json = JSON.stringify(guildResponse);
                        const obj = JSON.parse(json);
                        permissions = obj[i].permissions
                        if (permissions & 32) {
                            guildName = obj[i].name;
                            guildId = obj[i].id
                            guildIco = obj[i].icon
                            features = obj[i].features
                            let featureGif = features.includes("ANIMATED_ICON");
                            if (guildIco === null) {
                                guildIconURL = `https://cdn.evergene.io/default.png`
                            } else {
                                if (featureGif) {
                                    guildIconURL = `<img src="https://cdn.discordapp.com/icons/${guildId}/${guildIco}.gif">`;
                                } else {
                                    guildIconURL = `https://cdn.discordapp.com/icons/${guildId}/${guildIco}.png`;
                                }
                            }
                            guildNameAray.push(`${guildName}`);
                        }
                    }
                    req.session.guildName = guildNameAray;
                    console.log(JSON.stringify(guildNameAray));
                    res.redirect('/');
                });
            //GET USER
            fetch('https://discordapp.com/api/users/@me', {
                method: 'GET',
                headers: {
                    authorization: `${response.token_type} ${response.access_token}`
                },
            })
                .then(res2 => res2.json())
                .then(userResponse => {
                    console.log(userResponse.id);
                    userResponse.tag = `${userResponse.username}#${userResponse.discriminator}`;
                    if (userResponse.avatar) {
                        userResponse.avatarURL = userResponse.avatar ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024` : null;
                    } else {
                        userResponse.avatarURL = userResponse.avatar ? `https://cdn.evergene.io/default.png` : null;
                    }

                    con.query(`SELECT * FROM user WHERE discordId=${userResponse.id}`, function (err, result, fields) {
                        if (err) {
                            console.log('Error in DB');
                            console.error(err);
                            return;
                        } else {
                            if (result && result.length) {
                                con.query(`SELECT * FROM user WHERE discordId=${userResponse.id}`, function (err, result, fields) {
                                    if (err) throw err;
                                    const json = JSON.stringify(result);
                                    const obj = JSON.parse(json);
                                    const token = obj[0].token;
                                    let guildName = JSON.stringify(req.session.guildName);
                                    console.log('SELECT AND RENDER');
                                });
                            } else {
                                let token = makeid(24);
                                con.query(`INSERT INTO user (discordId, token, perms) VALUES ("${userResponse.id}", "${token}", 1)`, function (err, result) {
                                    if (err) throw err;
                                    console.log('INSERT AND RENDER');
                                });
                            }
                        }
                    });
                    req.session.user = userResponse;
                });
        });
});

router.get('/logout', forceAuth, (req, res) => {
    req.session.destroy();
    res.redirect('/')
});
console.log(chalk.bold.green(`OAuth2 Client started!`))

module.exports = router;