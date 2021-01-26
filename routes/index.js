const router = require('express').Router();
const { version } = require("../package.json");
const { host, user, password, database } = require('../config.json')
const mysql = require('mysql');
var con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
})

const forceAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
}

// THIS IS THE MAIN FILE FOR PAGES & API

// Render Index Page
router.get('/', (req, res) => {
    res.render('index', { version: version, pageTitle: 'Home', user: req.session.user || null });
});

// Render Profile Page
router.get('/profile', forceAuth, (req, res) => {
    function makeid(length) {
        var result = '';
        var characters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ.0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /* con.connect(function(err) {
         if (err) throw err;
         console.log("Connected!");
         var sql = `INSERT INTO user (discordId, token) VALUES ("${user.id}", "${makeid(24)}")`;
         con.query(sql, function (err, result) {
           if (err) throw err;
           console.log("1 record inserted");
         });
         con.end()
       });
     */

    res.render('profile', { token: makeid(24), version: version, pageTitle: 'Profile', user: req.session.user || null });
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
const Canvacord = require("canvacord");
const express = require('express');
const app = express();
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Active Endpoints
const endpoints = {
    "memes": 1,
    "awwnime": 0,
    "dankmemes": 1,
    "animemes": 1,
    "nsfw": 1,
    "animegif": 1,
    "interaction": 1,
    "test": 1,
    "nsfw": 1
}


// Render API MEMES Page
router.get('/api/dankmemes', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.dankmemes != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
    //res.render('dankmemes', { jsonData: JSON.stringify(url), image: image, version: version, pageTitle: 'API | DankMemes', user: req.session.user || null });

});

// Render API MEMES Page
router.get('/api/awwnime', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.awwnime != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API MEMES Page
router.get('/api/memes', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.memes != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API MEMES Page
router.get('/api/animemes', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animemes != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});
// Render API MEMES Page
router.get('/api/animegif', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animegif != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});
// Render API MEMES Page
router.get('/api/animewp', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animegif != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});
// Render API MEMES Page
router.get('/api/moe', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animegif != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        randomPuppy('Moescape')
            .then(url => {
                let image = url;
                if (image.endsWith(".mp4")) {
                    res.redirect('/api/moe');
                } else {
                    res.header("Content-Type", "application/json")
                    res.send(JSON.stringify({ url: image }, null, 3));
                }
            })
    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});
// Render API MEMES Page
router.get('/api/puppy', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animegif != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        randomPuppy('puppies')
            .then(url => {
                let image = url;
                if (image.endsWith(".mp4")) {
                    res.redirect('/api/puppy');
                } else {
                    res.header("Content-Type", "application/json")
                    res.send(JSON.stringify({ url: image }, null, 3));
                }
            })
    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});
// Render API MEMES Page
router.get('/api/aww', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animegif != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});
// Render API MEMES Page
router.get('/api/floof', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.animegif != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
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
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Hug
router.get('/api/hug', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.hug());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Tickle
router.get('/api/tickle', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.tickle());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Slap
router.get('/api/slap', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.slap());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Poke
router.get('/api/poke', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.poke());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Pat
router.get('/api/pat', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.pat());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Kiss
router.get('/api/kiss', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.kiss());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Feed
router.get('/api/feed', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.feed());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API interaction Cuddle
router.get('/api/cuddle', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.sfw.cuddle());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API TEST Clyde

/*router.get('/api/clyde', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.test != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        const text = 'TEXT'
        Canvacord.Canvas.clyde(text)
        .then(buffer => {
            Canvacord.write(buffer, "./clyde.png");
            
            // res.header("Content-Type", "application/json");
            // res.send(JSON.stringify({ url: image }, null, 3));
        });
    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});*/

// Render API nsfw Hentai Gif
router.get('/api/nsfw/hentaigif', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.randomHentaiGif());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Hentai Image
router.get('/api/nsfw/hentaiimage', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.hentai());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Hentai
router.get('/api/nsfw/hentai', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.hentai());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.randomHentaiGif());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Pussy
router.get('/api/nsfw/pussy', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random == 0) {
            async function outpud() {
                let image = (await neko.nsfw.pussy());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.pussyArt());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Neko
router.get('/api/nsfw/neko', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(3);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.nekoGif());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else if (random === 1) {
            async function outpud() {
                let image = (await neko.nsfw.eroNeko());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else if (random = 2) {
            async function outpud() {
                let image = (await neko.nsfw.neko());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Lesbian
router.get('/api/nsfw/lesbian', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.lesbian());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Kuni
router.get('/api/nsfw/kuni', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.kuni());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Cum
router.get('/api/nsfw/cum', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.cumArts());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.cumsluts());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }
    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Classic
router.get('/api/nsfw/classic', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.classic());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Boobs
router.get('/api/nsfw/boobs', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.boobs());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw BlowJob
router.get('/api/nsfw/blowjob', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.bJ());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.blowJob());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }
    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Anal
router.get('/api/nsfw/anal', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.anal());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Yuri
router.get('/api/nsfw/yuri', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2)
        if (random === 1) {
            async function outpud() {
                let image = (await neko.nsfw.yuri());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.eroYuri());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Trap
router.get('/api/nsfw/trap', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.trap());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Tits
router.get('/api/nsfw/tits', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.tits());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Solo Girl
router.get('/api/nsfw/sologirl', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.girlSoloGif());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.girlSolo());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Kemonomimi
router.get('/api/nsfw/kemonomimi', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(4);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.kemonomimi());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else if (random === 1) {
            async function outpud() {
                let image = (await neko.nsfw.eroKemonomimi());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else if (random === 2) {
            async function outpud() {
                let image = (await neko.nsfw.holo());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.holoEro());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }




    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Kitsune
router.get('/api/nsfw/kitsune', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.kitsune());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.eroKitsune());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }


    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Keta
router.get('/api/nsfw/keta', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.keta());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Holo
router.get('/api/nsfw/holo', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(2);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.holo());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.holoEro());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Futanari
router.get('/api/nsfw/futanari', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.futanari());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Femdom
router.get('/api/nsfw/femdom', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.femdom());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Feet
router.get('/api/nsfw/feet', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        let random = getRandomInt(3);
        if (random === 0) {
            async function outpud() {
                let image = (await neko.nsfw.feetGif());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else if (random === 1) {
            async function outpud() {
                let image = (await neko.nsfw.eroFeet());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        } else {
            async function outpud() {
                let image = (await neko.nsfw.feet());
                res.header("Content-Type", "application/json")
                res.send(JSON.stringify(image, null, 3));
            }

            outpud();
        }

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Ero
router.get('/api/nsfw/ero', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.ero());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Spank
router.get('/api/nsfw/spank', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.spank());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

// Render API nsfw Gasm
router.get('/api/nsfw/gasm', jsonParser, urlencodedParser, (req, res) => {
    if (endpoints.interaction != 1) {
        return res.send(JSON.stringify({ error: { "API ERROR": "ENDPOINT NOT ACTIVE IN CONFIG FILE" } }, null, 3));
    }
    try {
        async function outpud() {
            let image = (await neko.nsfw.gasm());
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(image, null, 3));
        }

        outpud();

    } catch (err) {
        return res.send(JSON.stringify({ error: { "API ERROR": "There was an error, please contact the administrator." } }, null, 3));
    }
});

module.exports = router;