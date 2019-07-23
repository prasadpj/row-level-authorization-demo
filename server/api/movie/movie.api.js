var Express = require('express');
var Controller = require('./../../controller/movie/movie.ctrl');
var middleware = require('./../../middleware/auth.middleware');
var Router = Express.Router();

// Router.use('/', middleware.checkMovieAccessRestriction);
Router.use('/:id', middleware.checkMovieAccessRestriction);


Router.get('/', Controller.readAll);
Router.get('/:id', Controller.read);
Router.post('/', Controller.create);
Router.put('/:id', Controller.update);
Router.delete('/:id', Controller.delete);

module.exports = Router;