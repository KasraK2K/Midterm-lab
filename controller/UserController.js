const Controller = require('controller/Controller');
const User = require('model/UserModel');
const passport = require('passport');


class UserController extends Controller {
    showAllUsers(req, res) {
        User
            .find({})
            .select({ name: true, email: true, password: true, writer: true, books: true })
            .sort({_id: -1})
            .populate('books')
            .exec( function (err, user) {
                if (err) throw new Error(err);
                res.render('user', {
                    users: user,
                    title: 'Show All Users'
                });
        });
    };

    // createUserProcess(req, res) {
    //     const {name, email, password, writer, admin, books } = req.body;
    //     if (name && email && password) {
    //         let newUser = new User(req.body);
    //         newUser
    //             .save()
    //             .then(user => {
    //                 res.json(user);
    //             })
    //             .catch(err => {
    //                 res.status(500).send(err);
    //                 throw new Error(err);
    //             })
    //     } else {
    //         res.status(401).send('Data Incomplete');
    //     }
    // };

    createUserProcess(req, res) {
        passport.authenticate('local.register', {
            successRedirect: '/user',
            failureRedirect: '/user/register',
            failureFlash: true
        })(req, res);
    };

    loginUserProcess(req, res, next) {
        passport.authenticate('local.login', (err, user) => {
            if (!user) return res.redirect('/user/login');
            req.logIn(user, err => { // passport syntax for login - user is login now
                return res.redirect('/');
            });
        })(req, res, next);
    };

    getUser(req, res) {
        const id = req.params.id;
        User
            .findById(id)
            .populate('books')
            .then(user => {
                res.json(user);
            })
            .catch(err => {
                res.status(500).send(err);
                throw new Error(err);
            });
    };

    updateUser(req, res) {
        const id = req.params.id;
        const { name, email, password, writer, admin, books } = req.body;
        if (name && email && password) {
            User
                .findByIdAndUpdate(id, {
                    name, email, password, writer, admin, books
                })
                .then(user => {
                    res.json(user);
                })
                .catch(err => {
                    res.status(500).send(err);
                    throw new Error(err);
                });
        } else {
            res.status(401).send('Data Incomplete');
        }
    };
}


module.exports = new UserController();