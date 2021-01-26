const chalk = require('chalk');
console.log(chalk.yellow('Server is starting...'))
const { resolveInclude } = require('ejs');
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.APP_PORT

app.set('port', port);

const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(session({
    secret: '48738924783748273742398747238',
    resave: false,
    saveUninitialized: false,
    expires: 604800000,
}));
require('./router')(app);
  

app.listen(port, () => console.log(chalk.bold.green(`Server started on port ${port}!`)));