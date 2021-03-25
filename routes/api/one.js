const Endpoint = require('../../classes/Endpoints/ApiEndpoint');
const express = require('express');

module.exports = (server, filename, path) => {
    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path
    }, null,
        async (req, res, endpoint, tools) => {
            handle(req.method, req, res, endpoint, tools);
        });

    new Endpoint(server, filename, {
        method: Endpoint.POST,
        path
    }, null,
        async (req, res, endpoint, tools) => {
            handle(req.method, req, res, endpoint, tools);
        });

    async function handle(method, req, res, endpoint, tools) {
        res.send(JSON.stringify({ method }, null, 2));
    }
}