var ObjectId = require('mongoose').Types.ObjectId;

var { Movie } = require('./../../schema/movie.model');

var crypto = require('crypto');
const _ = require('underscore');
var config = require('./../../config/index');
const constants = require("./../../config/constants")

module.exports = {
    create: create,

    update: update,

    delete: del,

    read: read,

    readAll: readAll,

}

function readAll(req, res, next) {
    let userRole = (req.user.role || "").toLowerCase();
    if (constants.roles.indexOf(userRole) == -1) {
        return res.status(400).send(`Unauthorized user!`);
    }
    let filter = userRole == "admin" ? {} :
        (userRole == "moderator" ? { isModeratorAccess: true } :
            (userRole == "viewer" ? { isViewerAccess: true } : null))
    filter = _.extend({ "isDeleted": { "$eq": false } }, filter || {})
    Movie.find(filter, (err, docs) => {
        if (!err)
            res.send(docs);
        else
            next(err)
    });
}
function read(req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    Movie.findById(req.params.id, (err, doc) => {
        if (!err)
            return res.send(doc);
        else
            next(err)
    });
}

function create(req, res, next) {
    var MovieModel = new Movie(_.extend({}, req.body));
    MovieModel.save((err, doc) => {
        if (!err)
            return res.send(doc);
        else
            next(err)
    });
}
function update(req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);
    var movie = _.extend({}, req.body)
    Movie.findByIdAndUpdate(req.params.id, { $set: movie }, { new: true }, (err, doc) => {
        if (!err)
            return res.send(doc);
        else
            next(err)
    });
}
function del(req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);
    Movie.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true } }, { new: true }, (err, doc) => {
        if (!err)
            return res.send(doc);
        else
            next(err)
    });
}
