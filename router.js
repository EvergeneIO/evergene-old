module.exports = (app) => {
    // '/'
    app.use('/', require('./routes/index'));

    // '/authorize'
    app.use('/authorize', require('./routes/discord'));

    // 'bot'
    app.use('/bot', require('./bot/bot'));

    // 'status'
    app.use('/status', require('./status/status'));

    // 'database'
    app.use('/database', require('./database'));
}