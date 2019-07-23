'use strict';

const path = require('path');
const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/index');
const db = require('./db');
const authCtrl = require('./controller/auth/auth.ctrl')
const middleware = require('./middleware/auth.middleware')
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.listen(process.env.PORT || 3001, () => console.log('server started at port:' + config.port));

// check if user is authenticated
app.use('/api/*', middleware.sessionExist)

app.use('/api/user', require('./api/user/user.api'));
app.use('/api/movie', require('./api/movie/movie.api'));

app.get('/logout', authCtrl.logout);
app.post('/login', authCtrl.login);

/* health check */
app.get('/healtcheck', (req, res, next) => {
    res.send('Good')
})
app.use((err, req, res, next) => {
    console.error(JSON.stringify(err, undefined, 2))
    res.status(500).send(err)
})