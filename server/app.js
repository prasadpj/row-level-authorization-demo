'use strict';

const path = require('path');
const express = require('express');
const Router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('underscore');
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


app.listen(config.port, () => console.log('server started at port:' + config.port));

app.use('/api/*', middleware.sessionExist)
app.get('/testing', (req, res, next) =>{
    res.send('Good')
})

app.use('/api/user', require('./api/user/user.api'));
app.use('/api/movie', require('./api/movie/movie.api'));

app.get('/logout', authCtrl.logout);
app.post('/login', authCtrl.login);
// app.use('/login', require('./api/user/user.api'));
