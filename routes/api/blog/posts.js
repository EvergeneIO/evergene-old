const Endpoint = require('../../../classes/Endpoints/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path,
    }, null,
        async (req, res, endpoint, tools) => {
            Endpoint.con.query("SELECT * FROM posts", function (err, result, fields) {
                if (err) throw err;
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify({ result }, null, 3));
            });
        });
}