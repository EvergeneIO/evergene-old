const Endpoint = require('../../classes/Endpoints/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path,
    }, null,
        async (req, res, endpoint, tools) => {
            let output = await tools.image(endpoint)
            res.header("Content-Type", "application/json");
            res.send(JSON.stringify({ url: output }, null, 3));
        });
}