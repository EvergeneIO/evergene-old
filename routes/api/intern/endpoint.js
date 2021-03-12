
const { checkKey, endpoints } = require('../../../functions');
const Endpoint = require('../../../classes/ApiEndpoint');

module.exports = (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.POST,
        path,
    },
        async (req, res, endpoint, tools) => {
            const token = req.header('Authorization');
            if (!token) {
                res.status('400').send({
                    status: 400, reason: "Invalid API Key"
                }, null, 3);
            } else {
                const dataJSON = JSON.stringify(req.body);
                const data = JSON.parse(dataJSON);
                const key = await checkKey(token);
                const checkJSON = JSON.stringify(key);
                const check = JSON.parse(checkJSON);
                const perms = check.perms;
                if (perms & 8) {
                    const end = req.body.endpoint;
                    if (await endpoints(end) == undefined) {
                        Endpoint.con.query(`INSERT INTO endpoints (name) VALUES ("${end}")`, function (err, result, fields) {
                            if (err) throw err;
                            res.status('200').send({ status: 200, msg: "Inserted" })
                        });
                    } else {
                        res.status('302').send({
                            status: 302, reason: "Found", msg: `Endpoint already exist!`
                        }, null, 3);
                    }
                } else {
                    res.status('401').send({
                        status: 401, reason: "Unauthorized"
                    }, null, 3);
                }
            }
        });

    new Endpoint(server, filename, {
        method: Endpoint.PUT,
        path,
    },
        async (req, res, endpoint, tools) => {
            const token = req.header('Authorization');
            if (!token) {
                res.status('400').send({
                    status: 400, reason: "Invalid API Key"
                }, null, 3);
            } else {
                const dataJSON = JSON.stringify(req.body);
                const data = JSON.parse(dataJSON);
                const key = await checkKey(token);
                const checkJSON = JSON.stringify(key);
                const check = JSON.parse(checkJSON);
                const perms = check.perms;
                if (perms & 8) {
                    const end = req.body.endpoint;
                    const status = req.body.status;
                    if (await endpoints(end) == undefined) return res.status('404').send({
                        status: 404, reason: "Not Found", msg: `Endpoint not exist!`
                    }, null, 3);
                    if (await endpoints(end) == !status) {
                        Endpoint.con.query(`UPDATE endpoints SET status = ${status} WHERE name = "${end}"`, function (err, result, fields) {
                            if (err) throw err;
                            res.status('200').send({ status: 200, msg: "Updated" })
                        });
                    } else {
                        res.status('302').send({
                            status: 302, reason: "Found", msg: `The status is already on ${status}`
                        }, null, 3);
                    }
                } else {
                    res.status('401').send({
                        status: 401, reason: "Unauthorized"
                    }, null, 3);
                }
            }
        });

    new Endpoint(server, filename, {
        method: Endpoint.DELETE,
        path,
    },
        async (req, res, endpoint, tools) => {
            const token = req.header('Authorization');
            if (!token) {
                res.status('400').send({
                    status: 400, reason: "Invalid API Key"
                }, null, 3);
            } else {
                const dataJSON = JSON.stringify(req.body);
                const data = JSON.parse(dataJSON);
                const key = await checkKey(token);
                const checkJSON = JSON.stringify(key);
                const check = JSON.parse(checkJSON);
                const perms = check.perms;
                if (perms & 8) {
                    const end = req.body.endpoint;
                    console.log(await endpoints(end))
                    if (await endpoints(end) != undefined) {
                        Endpoint.con.query(`DELETE FROM endpoints WHERE name = "${end}"`, function (err, result, fields) {
                            if (err) throw err;
                            res.status('200').send({ status: 200, msg: "Deleted" })
                        });
                    } else {
                        res.status('404').send({
                            status: 404, reason: "Not Found", msg: `Endpoint not exist!`
                        }, null, 3);
                    }
                } else {
                    res.status('401').send({
                        status: 401, reason: "Unauthorized"
                    }, null, 3);
                }
            }
        });
}

