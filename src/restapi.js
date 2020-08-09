require('./connections/connection.mongo')();
const express = require('express');
const bodyParser = require('body-parser');
const tokenMiddleware = require('./middlewares/middleware.token').tokenMiddleware;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ status: 'success', payload: { apiVersion: 1.0, writtenBy: 'LexClass Members', supervisedBy: 'Khalil Mohammed Shams <shamskhalil@gmail.com>', date: 'August 2020' }, message: 'Welcome to Lexclass REST API' });
});

//Auth Route
const authRoute = require('./routes/route.auth')();
app.use('/api/v1/auth', authRoute);

app.use(tokenMiddleware());

//User Rooute
const userRoute = require('./routes/route.user')();
app.use('/api/v1/user', userRoute);

//Admin Route
const adminRoute = require('./routes/route.admin')();
app.use('/api/v1/admin', adminRoute);

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});

module.exports.app = app;