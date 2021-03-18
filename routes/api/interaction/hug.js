const Endpoint = require('../../../classes/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        dynamic: ":test",
        path
    }, null,
        async (req, res, endpoint, tools) => {
            console.log(req.params.test)
            let output = await tools.image(endpoint);
            res.header("Content-Type", "application/json");
            res.send(JSON.stringify({ url: output }, null, 3));
        });
}