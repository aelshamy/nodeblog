var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'Register'
    });
});

router.post('/register', function(req, res, next) {

    //get form values
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var password2 = req.body.password2;
    var image = req.files[0];

    // check for image field
    if (image && image.fieldname == 'profileimage') {

        console.log('Uploading Files')

        //File Info
        var profile_image = image.originalname;

    } else {
        // set a default image
        var profile_image = 'placeholder.jpg'
    }


    //form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not a valid email').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profile_image: profile_image
        });

        User.getUserByUsername(function(err, user) {

            if (err) {

            } else {

                res.render('register', {
                    errors: errors,
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    password2: password2
                });

            }

        })


        // create user
        User.createUser(newUser, function(err, user) {
            if (err) {
                throw err;
            } else {
                console.log(user)
            }
        });

        //success message
        req.flash('success', 'you are now register and may log in ')
        res.location('/users/login');
        res.redirect('/users/login');
    }

});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                console.log('Unknown User');
                return done(null, false, {
                    message: 'Unknown User'
                });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('Invalid Password');
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                }
            });

            if (!user.isActive) {
                return done(null, false, {
                    message: 'User Not Active'
                });
            }

        });
    }
));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
}), function(req, res) {
    console.log('Authintication successfull');
    req.flash('success', 'You are logged in');
    res.redirect('/manage/posts');
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/');
});


module.exports = router;
