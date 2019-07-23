const mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    password: { type: String },
    role: { type: String },
    emailId: {
        type: String,
        required: true
    },
    sessionId: { type: String }     // for authorization purpose, is set on login and remove on logout
});

module.exports = { User };