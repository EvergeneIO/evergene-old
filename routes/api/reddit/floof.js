module.exports = {
    type: {
        "get": async (req, res, endpoint, tools) => {
            await tools.reddit(res, "floof");
        }
    }
}