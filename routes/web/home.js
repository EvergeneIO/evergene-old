const Endpoint = require('../../classes/Endpoints/MainEndpoint');
const con = require('./../../database/connection');
const fetch = require('node-fetch');
const posts = require('../api/blog/posts');
module.exports = (router, filename, path) => {

    new Endpoint(router, filename, {
        method: Endpoint.GET,
        path
    }, null,
        async (req, res, filename, lang, version, title, user) => {
            const posts = await (await fetch('http://localhost:3003/api/blog/posts').json);

            fetch('http://localhost:3003/api/blog/posts')
                .then(res => res.json())
                .then(posts => {
                    console.log(posts)
                    res.render(filename, { version: version, pageTitle: title, user: user, posts });
                });
        })
};