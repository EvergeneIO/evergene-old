module.exports = (app) => {
    // '/'
    app.use('/', require('./controller/main'));

    // '/api'
    app.use('/api', require('./controller/api'));

    app.use('/api/intern', require('./controller/intern'));

    // '/user-api'
    //app.use('/api/u', require('./controller/user-api'));

    // '/authorize'
    app.use('/authorize', require('./controller/authorize'));
}