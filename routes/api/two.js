const Endpoint = require('../../classes/ApiEndpoint');
const express = require('express');

module.exports = (server, filename, path) => {
    switch (method) {
        case 'GET':
            new Endpoint(server, filename, {
                method,
                path
            }, null,
                async (req, res, endpoint, tools) => {
                    console.log(req.params.test)
                    let output = await tools.image(endpoint);
                    res.header("Content-Type", "application/json");
                    res.send(JSON.stringify({ url: output }, null, 3));
                });
            break;
        case 'POST':
            new Endpoint(server, filename, {
                method,
                path
            }, null,
                async (req, res, endpoint, tools) => {
                    console.log(req.params.test)
                    let output = await tools.image(endpoint);
                    res.header("Content-Type", "application/json");
                    res.send(JSON.stringify({ url: output }, null, 3));
                });
            break;

        default:
            break;
    }
}