const Endpoint = require('../../../classes/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, 'uwu', {
        method: Endpoint.GET,
        path,
    }, null,

    async (req, res, endpoint, tools) => {
        res.send('OwO');
    });

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path,
    }, null,

    async (req, res, endpoint, tools) => {
        res.send('UwU');
    });

}