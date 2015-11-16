var express = require('express');

var router = express.Router();


//model
var Post = require('../models/post');

router.get('/', function(req, res, next) {

    var size = res.locals.pagesize,
        page = parseInt(req.query.page) || 0,
        skip = page > 0 ? ((page - 1) * size) : 0,
        nextpage = page == 0 ? page + 2 : page + 1,
        previouspage = nextpage - 2,
        previousPageLink = previouspage > 1 ? '?page=' + previouspage : '/';

    Post.getPosts({}, function(err, posts) {
        if (err) throw err;
        res.render('index', {
            title: '',
            posts: posts,
            page: page,
            nextPageLink: '?page=' + nextpage,
            previousPageLink: previousPageLink
        });

    }, size , skip);

});

module.exports = router;
