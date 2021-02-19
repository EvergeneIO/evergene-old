module.exports = {
    type: "get",
    status: true,
    dynamic: ':type',
    execute: async (req, res, endpoint, tools) => {
        //domain.com/api/u/newt/joke?type=programming
        res.send(req.params.type);
    }
}