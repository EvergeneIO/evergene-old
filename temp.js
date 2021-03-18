const fetch = require('node-fetch');
const Endpoint = require('./classes/LeagueEndpoint')

let jsonFile = Endpoint._categories
let name = 'yuri'
let id = jsonFile[name].id
// ! for schleife benötigt!
let data = fetch(`https://league-of-hentai.com/wp-json/wp/v2/tags?page=${id}&per_page=100`).json();

// ? if ergebniss = null dann sind alle seiten geladen

let slug = data[0].slug;
let id = data[0].id;