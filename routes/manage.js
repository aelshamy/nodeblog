var express = require('express');
var router = express.Router();


//models
var Post = require('../models/post');
var Category = require('../models/category');
var User = require('../models/user');



/* Mange Categories */
router.get('/posts', function(req, res, next) {

    Post.getPosts(function(err, posts) {

        if (err) throw err;
        res.render('posts/list', {
            title: 'Manage Posts',
            posts: posts
        });

    });


});


router.get('/posts/add', function(req, res, next) {

    Category.getCategories(function(err, categories) {
        User.getUsers(function(err, users) {
            res.render('posts/add', {
                title: 'Add Post',
                categories: categories,
                users: users
            });
        })

    });


});

router.post('/posts/add', function(req, res, next) {

    //get form value
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var author = req.body.author;
    var image = req.files[0];


    // check for image field
    if (image && image.fieldname == 'image') {

        //File Info
        var mainImageOriginalName = req.files[0].originalname;

    } else {
        // set a default image
        var mainImageOriginalName = 'placeholder.jpg'
    }


    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();


    var errors = req.validationErrors();


    if (errors) {

        Category.getCategories(function(err, categories) {
            Author.getAuthors(function(err, authors) {
                res.render('posts/add', {
                    errors: errors,
                    title: title,
                    body: body,
                    categories: categories,
                    authors: authors
                });

            });

        });


    } else {


        var newPost = new Post({
            title: title,
            body: body,
            category: category,
            author: author,
            image: mainImageOriginalName,
        });

        Post.createPost(newPost, function(err, post) {
            if (err) {
                res.send("There was an error submitting post")
            } else {
                //success message
                req.flash("Post Submitted");
                res.location('/manage/posts');
                res.redirect('/manage/posts');
            }
        });


    }

});

router.get('/posts/:id', function(req, res, next) {

    Post.getPostById(req.params.id,
        function(err, post) {

            if (err) throw err;

            Category.getCategories(function(err, categories) {
                User.getUsers(function(err, users) {
                    res.render('posts/edit', {
                        title: 'Edit Post',
                        post: post,
                        users: users,
                        categories: categories
                    });
                });
            });

        });

});


router.post('/posts/:id', function(req, res, next) {

    //get form value
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var author = req.body.author;
    var image = req.files[0];


    // check for image field
    if (image && image.fieldname == 'image') {

        //File Info
        var mainImageOriginalName = image.originalname;

    }


    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();


    var errors = req.validationErrors();


    if (errors) {

        Category.getCategories(function(err, categories) {
            User.getUsers(function(err, users) {
                res.render('posts/edit', {
                    errors: errors,
                    post: {
                    	_id: req.params.id,
                        title: title,
                        body: body,
                    },
                    categories: categories,
                    users: users
                });

            });

        });


    } else {


        var updatedPost = {
            title: title,
            body: body,
            category: category,
            author: author
        };

        if (mainImageOriginalName) {
            updatedPost.image = mainImageOriginalName
        }

        Post.editPost(req.params.id,
            updatedPost, {},

            function(err, category) {

                if (err) throw err;

                req.flash("Post Updated");
                res.location('/manage/posts');
                res.redirect('/manage/posts');
            });


    }

});



router.get('/posts/remove/:id', function(req, res, next) {

    Post.removePost(req.params.id,
        function(err, post) {

            if (err) throw err;

            req.flash("Post Removed");
            res.location('/manage/posts');
            res.redirect('/manage/posts');

        });

});

/* Mange Categories */
router.get('/categories', function(req, res, next) {

    Category.getCategories(function(err, categories) {

        if (err) throw err;
        res.render('categories/list', {
            title: 'Manage Categories',
            categories: categories
        });

    });


});

router.get('/categories/add', function(req, res, next) {

    res.render('categories/add', {
        title: 'Add Category'
    });

});

router.post('/categories/add', function(req, res, next) {


    //get form value
    var title = req.body.title;
    var description = req.body.description;


    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        res.render('addcategory', {
            errors: errors,
            title: title,
            description: description
        });
    } else {

        var newCategory = new Category({
            title: title,
            description: description
        });

        // create user
        Category.createCategory(newCategory, function(err, category) {
            if (err) {
                res.send("There was an error submitting the category")
            } else {
                //success message
                req.flash("Category Added");
                res.location('/manage/categories');
                res.redirect('/manage/categories');
            }
        });

    }

});


router.get('/categories/:id', function(req, res, next) {

    Category.getCategoryById(req.params.id,
        function(err, category) {

            if (err) throw err;

            res.render('categories/edit', {
                title: 'Edit Category',
                category: category
            });
        });

});


router.post('/categories/:id', function(req, res, next) {


    var updatedCategory = {
        title: req.body.title,
        description: req.body.description
    };

    Category.editCategory(req.params.id,
        updatedCategory, {},

        function(err, category) {

            if (err) throw err;

            req.flash("Category Updated");
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        });

});


router.get('/categories/remove/:id', function(req, res, next) {

    Category.removeCategory(req.params.id,
        function(err, category) {

            if (err) throw err;

            req.flash("Category Removed");
            res.location('/manage/categories');
            res.redirect('/manage/categories');

        });

});

/* Mange Users */

router.get('/users', function(req, res, next) {

    User.getUsers(function(err, users) {

        if (err) throw err;
        res.render('users/list', {
            title: 'Manage Users',
            users: users
        });

    });


});

router.get('/users/add', function(req, res, next) {

    res.render('users/add', {
        title: 'Register New User'
    });

});

router.post('/users/add', function(req, res, next) {


    //get form values
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    var image = req.files[0];

    // check for image field
    if (image && image.fieldname == 'profile_image') {

        //File Info
        var profile_image = image.originalname;

    } else {
        // set a default image
        var profile_image = 'no-image.png'
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
        res.render('users/add', {
            errors: errors,
            user: {
                name: name,
                username: username,
                email: email
            }
        });
    } else {
        var newUser = new User({
            name: name,
            username: username,
            password: password,
            email: email,
            profile_image: profile_image
        });

        // create user
        User.createUser(newUser, function(err, user) {
            if (err) {
                throw err;
            } else {
                //success message
                req.flash('success', 'You Successfully added new user')
                res.location('/manage/users');
                res.redirect('/manage/users');
            }
        });

    }

});


router.get('/users/:id', function(req, res, next) {

    User.getUserById(req.params.id,
        function(err, user) {

            if (err) throw err;

            res.render('users/edit', {
                title: 'Edit User',
                user: user
            });
        });

});


router.post('/users/:id', function(req, res, next) {


    //get form values
    var name = req.body.name;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    var image = req.files[0];

    // check for image field
    if (image && image.fieldname == 'profile_image') {

        //File Info
        var profile_image = image.originalname;

    }


    //form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not a valid email').isEmail();
    if (password.length > 0 && password2.length > 0) {
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    }

    var errors = req.validationErrors();
    if (errors) {
        res.render('users/edit', {
            errors: errors,
            user: {
                _id: req.params.id,
                name: name,
                email: email,
                username: req.body.username
            }
        });
    } else {
        var updatedUser = {
            name: name,
            email: email,
        };
        // if password changed set the new one
        if (password.length > 0) {
            updatedUser.password = password
        }

        // if profile image changed
        if (profile_image) {
            updatedUser.profile_image = profile_image
        }

        // Update user
        User.updateUser(req.params.id, updatedUser, {}, function(err, user) {
            if (err) {
                throw err;
            } else {
                //success message
                req.flash('success', 'The user has been updated')
                res.location('/manage/users');
                res.redirect('/manage/users');
            }
        });

    }

});

router.get('/users/remove/:id', function(req, res, next) {

    User.removeUser(req.params.id,
        function(err, user) {

            if (err) throw err;

            req.flash("Category Removed");
            res.location('/manage/users');
            res.redirect('/manage/users');

        });

});


module.exports = router;
