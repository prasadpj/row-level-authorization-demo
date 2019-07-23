const mongoose = require('mongoose');
const config = require('./config/index');


// mongoose.connect('mongodb://localhost:27017/MoviesDB', (err) => {
mongoose.connect(config.mongo.host,{ useNewUrlParser: true }, (err) => {
    if (!err)
        console.log('MongoDB connection succeeded');
    else{
        console.log('Error in Connection: ' + JSON.stringify(err, undefined, 2));
        process.exit(0)
    }
});

module.exports = mongoose;


