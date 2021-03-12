const Endpoint = require("../../../classes/ApiEndpoint.js");

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path
    },  
        async (req, res, endpoint, tools) => {
             await tools.reddit(res, "puppies");
        });
    
    
}