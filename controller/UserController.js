const Controller = require('controller/Controller');
const User = require('model/UserModel');
const Book = require('model/BookModel');
const passport = require('passport');


class UserController extends Controller {
    showAllUsers(req, res) {
        User
            .find({})
            .select({ name: true, email: true, password: true, writer: true, books: true })
            .sort({_id: -1})
            .populate('books', ['title'])
            .exec( function (err, user) {
                if (err) throw new Error(err);
                res.render('user', {
                    users: user,
                    title: 'Show All Users'
                });
        });
    };

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
                res.render('editUser', {
                    user: user
                });
            })
            .catch(err => {
                res.status(500).send(err);
                throw new Error(err);
            });
    };

    updateUser(req, res) {
        const id = req.params.id;
        const { name, email, password, writer, admin } = req.body;
        if (name && email && password) {
            User
                .findByIdAndUpdate(id, {
                    name, email, password, writer, admin
                })
                .then(user => {
                    res.redirect('/user');
                })
                .catch(err => {
                    res.status(500).send(err);
                    throw new Error(err);
                });
        } else {
            res.status(401).send('Data Incomplete');
        }
    };
    
    rentBook(req, res) {
        const books = req.user.books;
        if (books.indexOf(req.params.id) > -1) {
            res.redirect('/user');
        } else {
            books.push(req.params.id);
        } // If the user rents the book previously, he can not rent again
        if (books) {
            User
                .findByIdAndUpdate(req.user._id, { books })
                .then(user => {
                    res.redirect('/user');
                })
                .catch(err => {
                    res.status(500).send(err);
                    throw new Error(err);
                });
        } else {
            res.status(401).send('Data Incomplete');
        }
    };
    
    deleteUser(req, res) {
        User
            .findOneAndDelete(req.params.id, (err) => {
                if (err) throw new Error(err);
                res.redirect('/user');
            });
    }
    
    logout(req, res) {
        req.logout();
        res.redirect('/');
    };
}


module.exports = new UserController();
