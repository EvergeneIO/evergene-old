const Endpoint = require('../../classes/Endpoints/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path
    },  null,  
        async (req, res, endpoint, tools) => {
             await tools.reddit(res, "animemes");
        });
    
    
}