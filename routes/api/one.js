const Endpoint = require('../../classes/ApiEndpoint');
const express = require('express');

module.exports = (server, filename, path) => {
    const { method } = req;

    new Endpoint(server, filename, {
        method,
        path
    }, null,
        async (req, res, endpoint, tools) => {
            switch (method) {
                case 'GET':
                    try {
                        res.status(200).json({ response: 'You successfully completed a GET request!' });
                    } catch (error) {
                        res.status(502).json({ error: 'Something unexpected occured, please contact an administrator.' });
                    }
                    break;

                default:
                    res.status(404).json({ error: 'Not Found' });
            }
        });
}