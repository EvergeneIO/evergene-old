const pool = require('./database/connection');
const fetch = require('node-fetch');
const cookie = require('cookie');

module.exports = {

  checkKey: function (key) {
    return new Promise((res, rej) => {
      pool.query(`SELECT * FROM user WHERE token="${key}"`,
        function (err, result, fields) {
          if (err) {
            console.log('Error in DB');
            console.log(err);
            rej(err);
          } if (result && result.length) {
            if (err) throw err;
            console.log(chalk.green('TRUE'));
            let json = JSON.stringify(result);
            let obj = JSON.parse(json);
            let perms = obj[0].perms;
            res({ key: true, perms: perms });
          } else {
            console.log(chalk.red('FALSE'));
            res(false);
          }
        });
    });
  },

  makeid: function (length) {
    var result = '';
    var characters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ.0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  endpoints: function (endpoint) {
    return new Promise((res, rej) => {
      pool.query(`SELECT * FROM endpoints WHERE name="${endpoint}"`,
        function (err, result, fields) {
          if (err) {
            console.log('Error in DB');
            console.log(err);
            rej(err);
          } if (result && result.length) {
            if (err) throw err;
            let json = JSON.stringify(result);
            let obj = JSON.parse(json);
            let status = obj[0].status;
            res(status);
          } else {
            console.log(chalk.red('FALSE'));
            res(false);
          }
        });
    });
  },

  image: async function (endpoint) {
    try {
      let images = await (await fetch('https://cdn.evergene.io/image.json')).json();

      if (!images[endpoint]) throw new TypeError(`Invalid endpoint "${endpoint}"!`)

      let image = images[endpoint][Math.floor(Math.random() * images[endpoint].length)].image

      return `https://cdn.evergene.io/${endpoint}/${image}`;
    } catch (e) {
      throw e
    }
  },

  checkCookie: function (req, res) {
    let cookieName = '__cfduid';
    let lang = req.header('accept-language').split(',')[0];
    if (process.env.APP_MODE == 'dev') cookieName = 'test';

    if (req.cookies[cookieName]) {
      if (req.cookies.language) {
        lang = req.cookies.language;
      } else {
        res.setHeader('Set-Cookie', cookie.serialize('language', lang));
        lang = lang
      }
    } else {
      lang = lang
    }
    return lang;
  }

}