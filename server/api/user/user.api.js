var Express = require('express');
var Controller = require('./../../controller/user/user.ctrl');
var Router = Express.Router();


// allow routes only to admin 
Router.use('/', (req, res, next) => {
    if (req.user.role.toLowerCase() == "admin")
        return next()
    return res.status(400).send(`Unauthorized user!`);
});

Router.get('/', Controller.readAll);
Router.get('/:id', Controller.read);
Router.post('/', Controller.create);
Router.put('/:id', Controller.update);
Router.delete('/:id', Controller.delete);

module.exports = Router;