module.exports = {
    type: "get",
    execute: async (req, res, endpoint, tools) => {

        let output = await tools.image(endpoint)
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ url: output }, null, 3));
    }
}