module.exports = {
    execute: async (req, res, filename, lang, version, title, user) => {
        res.render(filename, { version: version, pageTitle: title, lang: lang, user: user });
    }
};