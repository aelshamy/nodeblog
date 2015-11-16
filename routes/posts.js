var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

//models
var Post = require('../models/post');
var Category = require('../models/category');
var User = require('../models/user');




router.get('/show/:id', function(req, res, next) {

    Post.getPostById(req.params.id, function(err, post) {
        res.render('posts/view', {
            title: "Show Post",
            post: post
        });
    });

});

router.get('/author/:author', function(req, res, next) {

    var author = req.params.author,
        url = req.originalUrl + '/?page=';
        size = res.locals.pagesize,
        page = parseInt(req.query.page) || 0,
        skip = page > 0 ? ((page - 1) * size) : 0,
        nextpage = page == 0 ? page + 2 : page + 1,
        previouspage = nextpage - 2,
        previousPageLink = previouspage != 1 ? '?page=' + previouspage : '?';


    Post.getPosts({
        author: author
    }, function(err, posts) {
        res.render('index', {
            title: author + '\'s Posts',
            posts: posts,
            page:page,
            nextPageLink: '?page=' + nextpage,
            previousPageLink: previousPageLink
        });
    }, size, skip);


});




router.post('/addcomment', function(req, res, next) {
    console.log(req)

    // var transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: '',
    //         pass: ''
    //     }
    // });

    // var mailOptions = {
    //     from: '' + name + ' ✔ <' + email + '>', // sender address
    //     to: 'ajmoroo@gmail.com', // list of receivers
    //     subject: 'New Comment From the site ✔', // Subject line
    //     text: 'a new comment is added to our site ✔', // plaintext body
    //     html: '<p>' + body + ' ✔</p>' // html body
    // };


    //get form value
    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var postid = req.body.postid;


    //form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Body field is required').notEmpty();
    req.checkBody('email', 'Email field is not a valid email').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();


    var errors = req.validationErrors();


    if (errors) {
        Post.getPostById(postid, function(err, post) {
            res.render('posts/view', {
                errors: errors,
                post: post
            });
        });

    } else {
        var comment = {
            name: name,
            email: email,
            body: body,
        }


        Post.addCommentsToPost(postid, comment, function(err, comment) {
            if (err) throw err;

            // transporter.sendMail(mailOptions, function(error, info) {
            //     if (error) {
            //         return console.log(error);
            //     }
            //     console.log('Message sent: ' + info.response);
            // });

            req.flash("success", "Comment added");
            res.location('/posts/show/' + postid);
            res.redirect('/posts/show/' + postid);
        });

    }

});

module.exports = router;
