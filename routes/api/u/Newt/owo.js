// endpoint = filename

module.exports = {
    type: "get",
    status: true,
    execute: async (req, res, endpoint, tools) => {
        // Your Functions

        let output = 'I am Newt OwO'
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify({ url: output }, null, 3));
    }
}