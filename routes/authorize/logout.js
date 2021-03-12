const Endpoint = require('../../classes/AuthEndpoint');

module.exports = (server, filename, path) => {
    new Endpoint(server, fileName, { method: Endpoint.GET, path }, function (req, res, fileName, tools) {
        req.session.destroy();
        res.redirect('/')
    }, )
}