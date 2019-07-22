var Express = require('express');
var Controller = require('./../../controller/movie/movie.ctrl');
var middleware = require('./../../middleware/auth.middleware');
var Router = Express.Router();

// Router.use('/', middleware.checkMovieAccessRestriction);
Router.use('/:id', middleware.checkMovieAccessRestriction);

Router.get('/', Controller.readAll);


Router.get('/:id', Controller.read);

Router.post('/', Controller.create);
// ================

Router.put('/:id', Controller.update);

// Craete movie access only for admin ========
/* Router.delete('/:id', (req, res, next) => {
    if (req.user.role.toLowerCase() == "admin")
        return next()
    return res.status(400).send(`Unauthorized user!`);
}); */
Router.delete('/:id', Controller.delete);
// ================

module.exports = Router;