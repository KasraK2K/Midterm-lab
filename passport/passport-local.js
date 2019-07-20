const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('model/UserModel');

// passport config
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// register strategy
passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({'email': email.toLowerCase()}, (err, user) => {
        if (err) return done(err); // If Error
        if (user) return done(null, false, req.flash('errors', 'چنین کاربری قبلا در سایت ثبت‌نام کرده است.'));

        const { name, writer, admin, books } = req.body;
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            writer,
            admin,
            books
        });

        newUser.save(err => {
            if (err) return done(null, false, req.flash('errors', 'ثبت‌نام با خطا مواجه شد. لطفا مجددا تلاش نمایید.'));
            done(null, newUser, req.flash('success', 'اکانت شما ساخته شد.'));
        });
    })
}));

// login strategy
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({'email': email.toLowerCase()}, (err, user) => {
        if (err) { return done(err) }; // If Error
        if (!user) { return done(null, false, req.flash('errors', 'ایمیل یا رمز ورود اشتباه است.')) };
        done(null, user);
    })
}));
