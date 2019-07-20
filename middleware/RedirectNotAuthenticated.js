const User  = require('model/UserModel');
const Middleware = require('./Middleware');

class RedirectIfAuthenticated extends Middleware {
    handle(req, res, next) {
        if (!req.isAuthenticated())
            res.redirect('back');
        next(); //  if user was authenticated keep moving and this middleware never runing
    };
}

module.exports = new RedirectIfAuthenticated();
