module.exports = {
    execute: async (req, res) => {
        req.session.destroy();
        res.redirect('/')
    }
}