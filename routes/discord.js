const chalk = require('chalk');
console.log(chalk.yellow('OAtuh2 Client is starting...'))
const router = require('express').Router();

const { clientId, clientSecret, scopes, redirectUri } = require('../config.json');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { response } = require('express');
const { guildIcon } = require('canvacord/src/Canvacord');

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
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', redirectUri);
    data.append('scope', scopes.join(' '));
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
                    console.log(userResponse);
                    userResponse.tag = `${userResponse.username}#${userResponse.discriminator}`;
                    if (userResponse.avatar) {
                        userResponse.avatarURL = userResponse.avatar ? `https://cdn.discordapp.com/avatars/${userResponse.id}/${userResponse.avatar}.png?size=1024` : null;
                    } else {
                        userResponse.avatarURL = userResponse.avatar ? `https://cdn.evergene.io/default.png` : null;
                    }


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