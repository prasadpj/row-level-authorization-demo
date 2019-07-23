var ObjectId = require('mongoose').Types.ObjectId;

var { User } = require('./../../schema/user.model');

var config = require('../../config/index.js');
var crypto = require('crypto');

var EncryptionKey = config.EncryptionKey;


module.exports = {
    login,
    logout
}

function login(req, res, next) {
    let password = crypto.createCipher("aes-256-ctr", EncryptionKey).update(req.body.password, "utf-8", "hex")
    User.findOne({ "emailId": req.body.emailId, "password": password }, (err, doc) => {
        if (!doc) {
            return res.status(400).send(`Invalid credentials!`);
        }
        if (!err) {
            if(doc.sessionId)
                return res.send("You are already logged in!")
            let response = {
                sessionId: crypto.createCipher("aes-256-ctr", EncryptionKey).update(doc._id.toString(), "utf-8", "hex")
            }
            User.findByIdAndUpdate(doc._id.toString(), { $set: { sessionId: response.sessionId } }, { new: true }, (err, newDoc) => {
                if (!err) {
                    return res.send(response);
                } else {
                    return next(err)
                }
            });
        } else {
            return next(err)
        }
    });

}

function logout(req, res, next) {
    var sessionId = req.headers['sessionid'];
    User.updateOne({ "sessionId": sessionId }, { $unset: { sessionId: 1 } }, {}, (err, newDoc) => {
        if (!err) {
            res.send("logout sucessfully!");
        } else {
            return next(err)
        }
    });
}