const chalk = require('chalk');
const router = require('express').Router();
const { version } = require("../package.json");
const fetch = require('node-fetch');
const pool = require('../database/connection');
const cookie = require('cookie');
const tools = require('../functions');

// THIS IS THE MAIN FILE FOR PAGES & API

router.get('/:id', (req, res) => {
    const lang = req.header('accept-language').split(',')[0];
    console.log(req.params.id)
    let id = ['1', '2']
    res.send('ID' + req.params.id);
});

module.exports = router;