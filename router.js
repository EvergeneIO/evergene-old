module.exports = (app) => {
    // '/'
    app.use('/', require('./handler/main'));

    // '/api'
    app.use('/api', require('./handler/api'));

    // '/user-api'
    app.use('/api/u', require('./handler/user-api'));

    // '/authorize'
    app.use('/authorize', require('./handler/authorize'));

    app.use('/test', require('./routes/test'));

    app.use(require('./database/migration'));
}