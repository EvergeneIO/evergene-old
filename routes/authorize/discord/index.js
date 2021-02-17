module.exports = {
    execute: async (req, res) => {
if(req.session.user) return res.redirect('/');

    const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${process.env.SCOPES}`;
    res.redirect(authorizeUrl);
}}