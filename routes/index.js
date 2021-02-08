const chalk = require('chalk');
console.log(chalk.yellow('Index is starting...'))
const router = require('express').Router();
const { version } = require("../package.json");
const mysql = require('mysql');
const fetch = require('node-fetch')

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


// CHECK API KEY
function checkKey(key) {
    return new Promise((res, rej) => {
        con.query(`SELECT * FROM user WHERE token="${key}"`,
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
};

let con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const forceAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
}

// THIS IS THE MAIN FILE FOR PAGES & API

// Render Index Page
router.get('/', (req, res) => {
    res.render('index', { version: version, pageTitle: 'Home', user: req.session.user || null });
});

router.get('/imprint', (req, res) => {
    res.render('imprint', { version: version, pageTitle: 'Imprint', user: req.session.user || null });
});

router.get('/privacy', (req, res) => {
    res.render('privacy', { version: version, pageTitle: 'Privacy', user: req.session.user || null });
});

router.get('/status', (req, res) => {
    res.render('status', { version: version, pageTitle: 'Status', user: req.session.user || null });
});

// Render Profile Page
router.get('/profile', forceAuth, (req, res) => {
    con.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
        if (err) {
            console.log('Error in DB');
            console.error(err);
            return;
        } else {
            if (result && result.length) {
                con.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
                    if (err) throw err;
                    const json = JSON.stringify(result);
                    const obj = JSON.parse(json);
                    const token = obj[0].token;
                    let guildName = JSON.stringify(req.session.guildName);
                    console.log('SELECT AND RENDER');

                    res.render('profile', { token: token, version: version, pageTitle: 'Profile', user: req.session.user, guildName: guildName || null });
                });
            } else {
                let token = makeid(24);
                con.query(`INSERT INTO user (discordId, token, perms) VALUES ("${req.session.user.id}", "${token}", 1)`, function (err, result) {
                    if (err) throw err;
                    console.log('INSERT AND RENDER');

                    res.render('profile', { token: token, version: version, pageTitle: 'Profile', user: req.session.user, guildName: req.session.guildName || null });
                });
            }
        }
    });
});

// Render Settings Page
router.get('/profile/settings', forceAuth, (req, res) => {
    con.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
        if (err) {
            console.log('Error in DB');
            console.error(err);
            return;
        } else {
            if (result && result.length) {
                con.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
                    if (err) throw err;
                    const json = JSON.stringify(result);
                    const obj = JSON.parse(json);
                    const token = obj[0].token;
                    let guildName = JSON.stringify(req.session.guildName);

                    console.log('SELECT AND RENDER');
                });
            } else {
                let token = makeid(24);
                con.query(`INSERT INTO user (discordId, token, perms) VALUES ("${req.session.user.id}", "${token}", 1)`, function (err, result) {
                    if (err) throw err;
                    console.log('INSERT AND RENDER');

                });
            }
        }
    });
    con.query(`SELECT * FROM user WHERE discordId=${req.session.user.id}`, function (err, result, fields) {
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

                    res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: 'reset', nsfw: false || null });
                } else if (req.param('key') == 'request') {

                    res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: 'request', nsfw: false || null });
                } else {

                    res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: false, nsfw: false || null });
                }
            } else {
                if (req.param('key') == 'reset') {

                    res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: 'reset', nsfw: true || null });
                } else if (req.param('key') == 'request') {

                    res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: 'request', nsfw: true || null });
                } else {

                    res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: false, nsfw: true || null });
                }
            }
        })()
    })
});

// Render About Page
router.get('/about', (req, res) => {
    res.render('about', { version: version, pageTitle: 'About', user: req.session.user || null });
});

// Render Contact Page
router.get('/contact', (req, res) => {
    res.render('contact', { version: version, pageTitle: 'Contact Us', user: req.session.user || null });
});

// Render Games Page
router.get('/games', (req, res) => {
    res.render('games', { version: version, pageTitle: 'Games', user: req.session.user || null });
});

// Render Team Page
router.get('/team', (req, res) => {
    res.render('team', { version: version, pageTitle: 'Team', user: req.session.user || null });
});

// Render Bugs Page
router.get('/bugs', (req, res) => {
    res.render('bugs', { version: version, pageTitle: 'Bugtracker', user: req.session.user || null });
});

// Render Changelogs Page
router.get('/changelog', (req, res) => {
    res.render('changelog', { version: version, pageTitle: 'Changelogs', user: req.session.user || null });
});

// Render TOS Page
router.get('/tos', (req, res) => {
    res.render('tos', { version: version, pageTitle: 'Terms Of Service', user: req.session.user || null });
});

// Render TOS Page
router.get('/privacy', (req, res) => {
    res.render('privacy', { version: version, pageTitle: 'Privacy Policy', user: req.session.user || null });
});

// Render Changelogs Page
router.get('/logout', (req, res) => {
    res.render('logout', { version: version, pageTitle: 'Logging Out...', user: req.session.user || null });
});


// Render API Page
router.get('/api', (req, res) => {
    res.render('api', { version: version, pageTitle: 'API', user: req.session.user || null });
});

// Render Discord Page
router.get('/discord', (req, res) => {
    res.render('discord', { version: version, pageTitle: 'Discord', user: req.session.user || null });
});

// Render NSFW Page
router.get('/api/nsfw', (req, res) => {
    res.render('nsfw', { version: version, pageTitle: 'NSFW', user: req.session.user || null });
});

// Render Invite Page
router.get('/discord/invite', (req, res) => {
    res.render('invite', { version: version, pageTitle: 'Invite', user: req.session.user || null });
});

// Render Partner Page
router.get('/partner', (req, res) => {
    res.render('partner', { version: version, pageTitle: 'Partner', user: req.session.user || null });
});

// Render Partner Request Page
router.get('/partner/request', (req, res) => {
    res.render('request', { version: version, pageTitle: 'Partner Request', user: req.session.user || null });
});

//Render 404 Page
/*router.get('*', function (req, res) {
    res.render('404', { version: version, pageTitle: '404 Not Found', user: req.session.user || null });
});*/

////////////////////////
//                    //
//     TEST AREA      //
//                    //
////////////////////////

router.get('/token/reset', function (req, res) {
    con.query(`SELECT * FROM user WHERE discordId = "${req.session.user.id}"`, function (err, result, fields) {
        const json = JSON.stringify(result);
        const obj = JSON.parse(json);
        const token = obj[0].token;
        (async () => {
            let key = await checkKey(token)
            if (key) {
                let token = makeid(24);
                con.query(`UPDATE user SET token = "${token}" WHERE discordId = ${req.session.user.id}`, function (err, result) {
                    if (err) throw err;
                    console.log('INSERT AND RENDER');
                    res.redirect('/profile/settings?key=reset');
                });
            } else {
                res.send({ error: "Invalid API Key" });
            }
        })()
    })
});


router.get('/nsfw', function (req, res) {
    let bday = new Date(req.param('bday'))
    let ts = bday.getTime();
    let date = Date.now() - 568025136000;
    if (ts <= date) {
        con.query(`UPDATE user SET perms = 3 WHERE discordId = "${req.session.user.id}"`, function (err, result) {
            if (err) throw err;
            res.redirect('/profile/settings?key=request')
        });
    } else {
        res.redirect('/profile/settings?nsfw=false')
    }
});


////////////////////////
//                    //
//        API         //
//                    //
////////////////////////

var bodyParser = require('body-parser');
const { json
} = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

const randomPuppy = require('random-puppy');
const nekoClient = require('nekos.life');
const neko = new nekoClient();
const canvacord = require("canvacord");
const express = require('express');
const { request } = require('express');
const app = express();
const imgur = require('imgur')
const fs = require('fs')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
};

/*function checkKey(key) {
    con.query(`SELECT * FROM user WHERE token="${key}"`, function (err, result, fields) {
        if (err) {
            console.log('Error in DB');
            console.log(err);
            return;
        } if (result && result.length) {
            if (err) throw err;
            console.log(chalk.green('TRUE'));
            return true;
        } else {
            console.log(chalk.red('FALSE'));
            return
        }
    });
}*/
//-----------------------------------//

router.post('/clyde', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.test != 1) {
        return res.send(JSON.stringify({ error: "ENDPOINT NOT ACTIVE IN CONFIG FILE" }, null, 3));
    } try {
        const json = JSON.stringify(req.body);
        const obj = JSON.parse(json);
        const token = obj.token;
        (async () => {
            let key = await checkKey(token);
            let permsJson = JSON.stringify(key);
            let permsObj = JSON.parse(permsJson);
            let perms = permsObj.perms;
            if (key) {
                console.log(perms)
                if (perms & 1) {
                    const text = obj.text;
                    canvacord.Canvas.clyde(text)
                        .then(buffer => {
                            canvacord.write(buffer, "clyde.png");

                            imgur.uploadFile('./clyde.png')
                                .then(function (json) {
                                    res.header("Content-Type", "application/json")
                                    res.send(JSON.stringify({ url: json.data.link }, null, 3));
                                    const path = 'clyde.png'
                                    try {
                                        fs.unlinkSync(path)
                                    } catch (err) {
                                        console.error(err)
                                    }
                                });
                        })
                        .catch(function (err) {
                            console.error(err.message);
                        });
                } else {
                    res.send({ error: "401 Unauthorized" });
                }
            } else {
                res.send({ error: "Invalid API Key" });
            }
        })()
    } catch (err) {
        console.error(err)
    }
});

//-----------------------------------//
// Active Endpoints
function endpoints(endpoint) {
    return new Promise((res, rej) => {
        con.query(`SELECT * FROM endpoints WHERE name="${endpoint}"`,
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
};

////////////////////////
//                    //
//        POST        //
//                    //
////////////////////////

/*router.post('/clyde', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.test != 1) {
        return res.send(JSON.stringify({ error: "ENDPOINT NOT ACTIVE IN CONFIG FILE" }, null, 3));
    } try {
        const json = JSON.stringify(req.body);
        const obj = JSON.parse(json);
        const token = obj.token;
        let key = checkKey(token);
        if (key) {
            const text = obj.text;
            canvacord.Canvas.clyde(text)
                .then(buffer => {
                    canvacord.write(buffer, "clyde.png");

                    imgur.uploadFile('./clyde.png')
                        .then(function (json) {
                            res.header("Content-Type", "application/json")
                            res.send(JSON.stringify({ url: json.data.link }, null, 3));
                            const path = 'clyde.png'
                            try {
                                fs.unlinkSync(path)
                            } catch (err) {
                                console.error(err)
                            }
                        });
                })
                .catch(function (err) {
                    console.error(err.message);
                });
        } else {
            res.send({ error: "Invalid API Key" });
        }
    } catch (err) {
        console.error(err)
    }
});*/


router.get('/test', jsonParser, urlencodedParser, (req, res) => {
    const json = JSON.stringify(req.body);
    const obj = JSON.parse(json);
    const apiKey = obj.api_key;
    if (apiKey === 'abc') {
        res.send(req.body)
    } else {
        res.send({ error: "Invalid API Key!" }, null, 3);
    }
});

router.post('/test-two', jsonParser, urlencodedParser, (req, res) => {
    res.send(req.param('test'));
});

router.get('/test-three', jsonParser, urlencodedParser, (req, res) => {
    //console.log(req.param('test'));
    //res.send(req.param('test'));
    res.send('hay')
});


////////////////////////
//                    //
//        GET         //
//                    //
////////////////////////

//app.use(health.ping());

router.post('/api/partner', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'partner';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
    })()
    try {
        const json = JSON.stringify(req.body);
        const data = JSON.parse(json);
        const token = req.header('Authorization');
        if (!token) {
            res.status('400').send({
                status: 400, "reason": "Invalid API Key", "msg": "Token could not be found, please create one in which you log in", "url": "https://http.cat/400"
            }, null, 3);
        } else {
            (async () => {
                let key = await checkKey(token);
                let permsJson = JSON.stringify(key);
                let permsObj = JSON.parse(permsJson);
                let perms = permsObj.perms;
                if (perms & 4) {
                    let id = data.id;
                    let total = data.member[0].total;
                    let online = data.member[0].online;
                    if (!id || !total || !online) {
                        if (!id) {
                            res.send({
                                "msg": "ID Required!"
                            }, null, 3);
                        } else if (!total) {
                            res.send({
                                "msg": "Total Required!"
                            }, null, 3);
                        } else if (!online) {
                            res.send({
                                "msg": "Online Required!"
                            }, null, 3);
                        }
                    } else {
                        con.query(`SELECT * FROM partner WHERE serverId = ${id}`, function (err, result, fields) {
                            if (err) throw err;
                            if (result && result.length) {
                                res.send({
                                    "msg": 'Your server is already indexed, please use the "PUT" option'
                                }, null, 3);
                            } else {
                                con.query(`INSERT INTO partner (serverId, total, online) VALUES (${id}, ${total}, ${online})`, function (err, result) {
                                    if (err) throw err;
                                });
                            }
                        });
                    }
                } else {
                    res.status('401').send({
                        status: 401, "reason": "Unauthorized", "msg": "The token does not have the rights to make a request, please contact an administrator to request rights!", "url": "https://http.cat/401"
                    }, null, 3);
                }
            })()
        }
    } catch (err) {
        return res.status('500').send({
            status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
        }, null, 3);
    }
});

router.put('/api/partner', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'partner';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
    })()
    try {
        const json = JSON.stringify(req.body);
        const data = JSON.parse(json);
        const token = req.header('Authorization');
        if (!token) {
            res.status('400').send({
                status: 400, "reason": "Invalid API Key", "msg": "Token could not be found, please create one in which you log in", "url": "https://http.cat/400"
            }, null, 3);
        } else {
            (async () => {
                let key = await checkKey(token);
                let permsJson = JSON.stringify(key);
                let permsObj = JSON.parse(permsJson);
                let perms = permsObj.perms;
                if (perms & 4) {
                    let id = data.id;
                    let total = data.member[0].total;
                    let online = data.member[0].online;
                    if (!id || !total || !online) {
                        if (!id) {
                            res.send({
                                "msg": "ID Required!"
                            }, null, 3);
                        } else if (!total) {
                            res.send({
                                "msg": "Total Required!"
                            }, null, 3);
                        } else if (!online) {
                            res.send({
                                "msg": "Online Required!"
                            }, null, 3);
                        }
                    } else {
                        con.query(`SELECT * FROM partner WHERE serverId = ${id}`, function (err, result, fields) {
                            if (err) throw err;
                            if (result && result.length) {
                                con.query(`UPDATE partner SET total = ${total}, online = ${online} WHERE serverId = ${id}`, function (err, result) {
                                    if (err) throw err;
                                    console.log('Inserted')
                                });
                                res.send('OK')
                            } else {
                                res.send({
                                    "msg": 'Your server is not indexed, please use the "POST" option'
                                }, null, 3);
                            }
                        });
                    }
                } else {
                    res.status('401').send({
                        status: 401, "reason": "Unauthorized", "msg": "The token does not have the rights to make a request, please contact an administrator to request rights!", "url": "https://http.cat/401"
                    }, null, 3);
                }
            })()
        }
    } catch (err) {
        return res.status('500').send({
            status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
        }, null, 3);
    }
});

// Render API MEMES Page
router.get('/api/dankmemes', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'dankmemes';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('dankmemes')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/dankmemes');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
        //res.render('dankmemes', { jsonData: JSON.stringify(url), image: image, version: version, pageTitle: 'API | DankMemes', user: req.session.user || null });
    })()
});

// Render API MEMES Page
router.get('/api/awwnime', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'awwnime';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('awwnime')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/awwnime');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Render API MEMES Page
router.get('/api/memes', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'memes';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('memes')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/memes');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Render API MEMES Page
router.get('/api/animemes', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'animemes';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('Animemes')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/animemes');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});
// Render API MEMES Page
router.get('/api/animegif', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'animegif';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('animegifs')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/animegif');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});
// Render API MEMES Page
router.get('/api/animewp', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'animewp';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('Animewallpaper')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/animewp');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});
// Render API MEMES Page
router.get('/api/moe', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'moe';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('Moescape')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/moe');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ error: "ENDPOINT NOT ACTIVE IN CONFIG FILE" }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});
// Render API MEMES Page
router.get('/api/puppy', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'puppy';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('puppies')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/puppy');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ error: "ENDPOINT NOT ACTIVE IN CONFIG FILE" }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Render API MEMES Page
router.get('/api/aww', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'aww';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('aww')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/aww');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});
// Render API MEMES Page
router.get('/api/floof', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'floof';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            randomPuppy('floof')
                .then(url => {
                    let image = url;
                    if (image.endsWith(".mp4")) {
                        res.redirect('/api/floof');
                    } else {
                        res.header("Content-Type", "application/json")
                        res.send(JSON.stringify({ url: image }, null, 3));
                    }
                })
        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Hug \\
router.get('/api/hug', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'hug';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;

                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Tickle \\
router.get('/api/tickle', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'tickle';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Slap \\
router.get('/api/slap', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'slap';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Poke \\
router.get('/api/poke', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'poke';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Pat \\
router.get('/api/pat', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'pat';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Kiss \\
router.get('/api/kiss', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'kiss';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Feed \\
router.get('/api/feed', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'feed';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Endpoint: Cuddle \\
router.get('/api/cuddle', jsonParser, urlencodedParser, (req, res) => {
    const endpoint = 'cuddle';
    (async () => {
        let status = await endpoints(endpoint);
        if (status != 1) {
            return res.status('503').send({
                status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
            }, null, 3);
        }
        try {
            async function output() {
                let number = getRandomInt(200);
                await fetch('https://cdn.evergene.io/image.json')
                    .then(res => res.json())
                    .then(json => {
                        let image = json[endpoint][number].image;
                        let output = `https://cdn.evergene.io/${endpoint}/${image}`
                        res.header("Content-Type", "application/json");
                        res.send(JSON.stringify({ url: output }, null, 3));
                    });
            }

            output();

        } catch (err) {
            return res.status('500').send({
                status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
            }, null, 3);
        }
    })()
});

// Render API TEST Clyde

/*router.get('/api/clyde', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.test != 1) {
        return     res.status('503').send({
        status: 503, "reason": "Service Unavailable", "msg": "Endpoint not Active in Config file", "url": "https://http.cat/503"
    }, null, 3);
    }
    try {
        const text = 'TEXT'
        canvacord.Canvas.clyde(text)
        .then(buffer => {
            canvacord.write(buffer, "./clyde.png");
            
            // res.header("Content-Type", "application/json");
            // res.send(JSON.stringify({ url: image }, null, 3));
        });
    } catch (err) {
        return res.status('500').send({
        status: 500, "reason": "Internal Server Error", "msg": "please contact a administrator", "url": "https://http.cat/500"
    }, null, 3);
    }
});*/

console.log(chalk.bold.green(`Index started!`))
module.exports = router;