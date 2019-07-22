const mongoose = require('mongoose');
const config = require('./config/index');


mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db, (err) => {
    if (!err)
        console.log('MongoDB connection succeeded');
    else
        console.log('Error in Connection: ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;


