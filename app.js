const chalk = require('chalk');
const Embed = require('./actions/Embed')
console.log(chalk.yellow('Server is starting...'))

new Embed('817546892065505290', 'System', Embed.STARTING, {
    webID: process.env.WEBHOOK_ID,
    webTOKEN: process.env.WEBHOOK_TOKEN
}, "./actions/data/temp.txt", Date.now(), process.env.APP_MODE);

const { resolveInclude } = require('ejs');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID || '813143436621643806', process.env.WEBHOOK_TOKEN || 'CZBAIJBwv2AiKAl7NfGTLmHigLhjS9P_X_eGN8Br1B6PM8B-uadkk1qomaokeK0B21eu');

dotenv.config();

const port = process.env.APP_PORT

app.set('port', port);

const session = require('express-session');
const router = require('./router');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(cookieParser());
app.use(morgan('dev'))
app.use(session({
    secret: '48738924783748273742398747238',
    resave: false,
    saveUninitialized: false,
    expires: 604800000,
}));
require('./router')(app);

app.listen(port, () => {
    console.log(chalk.bold.green(`Server started on port ${port}!`));
    let date = Date.now();
    setTimeout(() => {
        new Embed('817546892065505290', 'System', Embed.STARTED, {
            webID: process.env.WEBHOOK_ID,
            webTOKEN: process.env.WEBHOOK_TOKEN
        }, "./actions/data/temp.txt", date, process.env.APP_MODE);
    }, 1000);

});