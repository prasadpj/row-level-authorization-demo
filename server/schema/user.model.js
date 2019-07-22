const mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: { 
        type: String,
        required : true
    },
    password: { type: String },
    role: { type: String },
    emailId: { 
        type: String,
        required : true
    },
    sessionId : {type : String}
});

module.exports = { User };