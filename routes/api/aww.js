const Endpoint = require('../../classes/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path
    },  null,  
        async (req, res, endpoint, tools) => {
             await tools.reddit(res, "aww");
        });
    
    
}