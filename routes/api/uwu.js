const Endpoint = require('../../classes/Endpoints/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path
    }, 8,
        async (req, res, endpoint, tools) => {
            res.header("Content-Type", "application/json");
            res.send(JSON.stringify({ url: 'output' }, null, 3));
        });
}