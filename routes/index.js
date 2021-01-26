const chalk = require('chalk');
console.log(chalk.yellow('Index is starting...'))
const router = require('express').Router();
const { version } = require("../package.json");

// THIS IS THE MAIN FILE FOR PAGES

// Render Index Page
router.get('/', (req, res) => {
    res.render('index', { version: version, pageTitle: 'Home', user: req.session.user || null });
});

// Render Index Page
router.get('/profile', (req, res) => {
    res.render('profile', { version: version, pageTitle: 'Profile', user: req.session.user || null });
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

//Render Modul Page
router.get('/module', function (req, res) {
    res.render('module', { version: version, pageTitle: 'Module', user: req.session.user || null });
});

// Render Settings Page
router.get('/profile/settings', (req, res) => {
    if (req.param('key') == 'reset') {
        res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: 'reset', nsfw: true || null });
    } else if (req.param('key') == 'request') {
        res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: 'request', nsfw: true || null });
    } else {
        res.render('settings', { version: version, pageTitle: 'Settings', user: req.session.user, alert: false, nsfw: true || null });
    }
});

console.log(chalk.bold.green(`Index started!`))
module.exports = router;