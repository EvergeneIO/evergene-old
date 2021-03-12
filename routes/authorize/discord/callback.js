const Endpoint = require('../../../classes/AuthEndpoint.js');
const FormData = require('form-data');
const { makeid, checkKey } = require("../../../functions");
const fetch = require('node-fetch');


module.exports = (server, filename, path) => {
    new Endpoint(server, fileName, { method: Endpoint.GET, path }, function (req, res, fileName, tools) {
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

                        Endpoint.con.query(`SELECT * FROM user WHERE discordId=${userResponse.id}`, function (err, result, fields) {
                            if (err) {
                                console.log('Error in DB');
                                console.error(err);
                                return;
                            } else {
                                if (result && result.length) {
                                    Endpoint.con.query(`SELECT * FROM user WHERE discordId=${userResponse.id}`, function (err, result, fields) {
                                        if (err) throw err;
                                        const json = JSON.stringify(result);
                                        const obj = JSON.parse(json);
                                        const token = obj[0].token;
                                        let guildName = JSON.stringify(req.session.guildName);
                                        console.log('SELECT AND RENDER');
                                    });
                                } else {
                                    let token = makeid(24);
                                    Endpoint.con.query(`INSERT INTO user (discordId, token, perms) VALUES ("${userResponse.id}", "${token}", 1)`, function (err, result) {
                                        if (err) throw err;
                                        console.log('INSERT AND RENDER');
                                    });
                                }
                            }
                        });
                        console.log(userResponse)
                        req.session.user = userResponse;
                    });
            });
    });
};
