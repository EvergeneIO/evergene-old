module.exports = (app) => {
    // '/'
    app.use('/', require('./handler/main'));

    // '/api'
    app.use('/api', require('./handler/api'));

    // '/authorize'
    app.use('/authorize', require('./handler/authorize'));

    app.use('/test', require('./routes/test'));

    app.use(require('./discord/bot'));
}