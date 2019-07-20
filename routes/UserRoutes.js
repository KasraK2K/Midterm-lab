const express = require('express');
const router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });


// Middleware
const RedirectIfAuthenticated = require('middleware/RedirectIfAuthenticated');
const RedirectNotAuthenticated = require('middleware/RedirectNotAuthenticated');

// Controllers
const UserController = require('controller/UserController');

router.route('/')
    .get(UserController.showAllUsers); // Show All user

router.route('/register')
    .all( RedirectIfAuthenticated.handle )
    .get((req, res) => { res.render('register') })
    .post(UserController.createUserProcess); // Create User

router.route('/login')
    .all( RedirectIfAuthenticated.handle )
    .get((req, res) => { res.render('login') })
    .post(UserController.loginUserProcess); // Login User

router.route('/:id')
    .all( RedirectNotAuthenticated.handle )
    .get(UserController.getUser) // Get Single User Info
    .put(UserController.updateUser); // User Update

router.route('/profile')
    .all( RedirectNotAuthenticated.handle )
    .get((req, res) => {
        res.render('profile');
    }); // show profile form

router.post('/profile', upload.single('avatar'), function (req, res, next) {
    res.send(req.file);
}); // upload profile avatar


module.exports = router;
