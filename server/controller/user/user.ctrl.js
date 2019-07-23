var ObjectId = require('mongoose').Types.ObjectId;

var { User } = require('./../../schema/user.model');

var crypto = require('crypto');

var config = require('../../config/index.js');

var EncryptionKey = config.EncryptionKey;


module.exports = {

    create: create,

    update: update,

    delete: del,

    read: read,

    readAll: readAll,

}

function readAll(req, res, next) {
    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retriving ClinetRegister: ' + JSON.stringify(err, undefined, 2)); }
    });
}
function read(req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    User.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in retriving User: ' + JSON.stringify(err, undefined, 2)); }
    });
}

function create(req, res, next) {
    var UserModel = new User({
        name: req.body.name,
        password: crypto.createCipher("aes-256-ctr", EncryptionKey).update(req.body.password, "utf-8", "hex"),
        role: req.body.role ? req.body.role.toLowerCase() : null,
        emailId: req.body.emailId,
    });
    UserModel.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Save: ' + JSON.stringify(err, undefined, 2)); }
    });
}
function update(req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);
    let user = _.extend({}, req.body)
    if (user.password)
        user.password = crypto.createCipher("aes-256-ctr", EncryptionKey).update(user.password, "utf-8", "hex")
    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Update User: ' + JSON.stringify(err, undefined, 2)); }
    });
}

function del(req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Delete User: ' + JSON.stringify(err, undefined, 2)); }
    });
}