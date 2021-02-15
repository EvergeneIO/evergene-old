module.exports = (app) => {
    // '/'
    app.use('/', require('./routes/index'));

    // '/api'
    app.use('/api', require('./routes/api'));

    // '/authorize'
    app.use('/authorize', require('./routes/discord'));

    app.use('/bot', require('./discord/bot'))
}