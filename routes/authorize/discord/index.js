const Endpoint = require('../../../classes/AuthEndpoint');

module.exports = (server, filename, path) => {
    new Endpoint(server, fileName, { method: Endpoint.GET, path }, function (req, res, fileName, tools) {
        if (req.session.user) return res.redirect('/');
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${process.env.SCOPES}`);
    });
}