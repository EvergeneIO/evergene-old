const Endpoint = require('../../../classes/Endpoints/MainEndpoint');

module.exports = (router, filename, path) => {

    new Endpoint(router, filename, {
        method: Endpoint.GET,
        path
    }, null,
        async (req, res, filename, lang, version, title, user) => {
            //throw new Error;
            res.render(`setsuna-commands`, { version: version, pageTitle: title, user: user });
        })
};