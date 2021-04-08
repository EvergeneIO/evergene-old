const Endpoint = require('../../classes/Endpoints/MainEndpoint');
const con = require('../../database/connection');
const fetch = require('node-fetch');
module.exports = (router, filename, path) => {

    new Endpoint(router, filename, {
        method: Endpoint.GET,
        path, 
        dynamic: '/post/:id'
    }, null,
        async (req, res, filename, lang, version, title, user) => {
            con.query(`SELECT * FROM posts WHERE id=${req.params.id}`, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
              });

            fetch('http://localhost:3003/api/blog/posts')
                .then(res => res.json())
                .then(posts => {
                    console.log(posts)
                    res.render(filename, { version: version, pageTitle: title, user: user, posts });
                });
        })
};