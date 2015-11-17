var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog');
var db = mongoose.connection;

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})


var multer_config = multer({
    storage: storage
}).any();



var flash = require('connect-flash');


var index = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var uploads = require('./routes/uploads');
var manage = require('./routes/manage');
var users = require('./routes/users');

var app = express();

//globals
app.locals.moment = require('moment');
app.locals.truncate = require('truncate');
app.locals.changeCase = require('change-case');

app.locals.pagesize = 5;
app.locals.brand = 'Node Blog';
app.locals.adminBrand = 'Node Admin';

app.use(function(req, res, next) {
  res.locals.pagesize = app.locals.pagesize;
  // res.locals.brand = app.locals.brand;
  // res.locals.adminBrand = app.locals.adminBrand;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer_config);

app.use(cookieParser());

//handle express sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());


//validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


app.use(express.static(path.join(__dirname, 'public')));

//connect flash
app.use(flash());

//send messages to jade templates
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//give acess to user object in all views
app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});


app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);
app.use('/uploads', uploads);
app.use('/manage', manage);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
