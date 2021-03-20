const pool = require('./database/connection');
const fetch = require('node-fetch');
const cookie = require('cookie');
const chalk = require('chalk')

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

  endpoints: function (endpoint, table = "endpoints") {
    return new Promise((res, rej) => {
      pool.query(`SELECT * FROM ${table} WHERE name="${endpoint}"`,
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
            res(undefined);
          }
        });
    });
  },

  image: async function (endpoint) {
    try {
      let images = await (await fetch('http://localhost:3002/image.json')).json();

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
  },

  forceAuth: async function (req, res, next) {
    if (!req.session.user) return res.redirect('/authorize/discord')
    else return next();
  },

  reddit: async function (res, reddit) {
    try {
      let url = `https://www.reddit.com/r/${reddit}/hot/.json?count=1000`;

      let allPosts = await (await fetch(url)).json();

      let posts = allPosts.data.children.filter((m) => !m.is_video && ["png","jpg", "jpeg","gif"].includes(m.data.url.split(".").pop()));
      let post = posts[Math.floor(Math.random() * posts.length)].data;
      res.removeHeader("Connection");
      res.removeHeader("ETag");
      res.removeHeader("X-Powered-By");
      res.header("Content-Type", "application/json");
      return res.send(JSON.stringify({ url: post.url }, null, 3));
    } catch (e) {
      res.removeHeader("Connection");
      res.removeHeader("ETag");
      res.removeHeader("X-Powered-By");
      res.header("Content-Type", "application/json");
      return res.status('500').send({
        status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
      }, null, 3);
    }
  }

}