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
    
});

router.get('/logout', forceAuth, (req, res) => {
    req.session.destroy();
    res.redirect('/')
});
console.log(chalk.bold.green(`OAuth2 Client started!`))

module.exports = router;