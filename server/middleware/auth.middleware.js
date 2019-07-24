var ObjectId = require('mongoose').Types.ObjectId;

var { User } = require('./../schema/user.model');
var { Movie } = require('./../schema/movie.model');

const _ = require("underscore")
const constants = require("./../config/constants")
module.exports = {
    sessionExist,
    checkMovieAccessRestriction
}

function sessionExist(req, res, next) {
    if (!req.headers['sessionid']) {
        return res.status(400).send(`Unauthorized user!`);
    }
    let sessionId = req.headers['sessionid']
    User.findOne({ "sessionId": sessionId }, (err, doc) => {
        if (!doc) {
            return res.status(400).send(`Unauthorized user!`);
        }
        if (!err) {
            req.user = doc
            next()
        } else {
            console.log('erro while checking authorization ' + JSON.stringify(err, undefined, 2));
        }
    });
}

function checkMovieAccessRestriction(req, res, next) {
    let userRole = (req.user.role || "").toLowerCase()
    if (req.method == "POST") {
        if (userRole == "admin")
            return next()
        return res.status(400).send(`Access denied!`);
    }
    if (req.method == "PUT" || req.method == "DELETE") {
        if (userRole == "admin")
            return next()
        if (userRole == "moderator") {
            Movie.find({ _id: req.params.id, isModerator: true }, (err, docs) => {
                if (docs.length > 0) {
                    req.body = filterReqBody(req.body)
                    return next()
                }
                return res.status(400).send(`Access denied!`);
            })
        } else {
            return res.status(400).send(`Access denied!`);
        }
    }
    if (req.method == "GET") {
        if (userRole == "admin")
            return next()
        if (constants.roles.indexOf(userRole) == -1) {
            return res.status(400).send(`Access denied!`);
        }
        if (req.params.id) {
            let filter = userRole == "admin" ? {} :
                (userRole == "moderator" ? { isModeratorAccess: true } :
                    (userRole == "viewer" ? { isViewerAccess: true } : null))
            filter = _.extend({ "isDeleted": { "$eq": false }, "_id": req.params.id }, filter || {})
            Movie.find(filter, (err, docs) => {
                if (docs.length > 0) {
                    return next()
                }
                return res.status(400).send(`Access denied!`);
            })
        } else {
            return next()
        }
    }
}
function filterReqBody(reqBody) {
    let newReqBody = {}
    Object.keys(reqBody).forEach((key) => {
        if (key != "isModeratorAccess" && key != "isViewerAccess") {
            newReqBody[key] = reqBody[key]
        }
    })
    return newReqBody;
}